import { NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';

import { db } from '@/lib/db'
import { rpName, rpID } from '@/lib/webauthn'

export async function GET(req: Request) {
    let user
    try {
        user = await getUserFromDB('ace')
    } catch (e) {
        let err = e as Error
        return new NextResponse(`get user from db failed: ${err.message}`, {
            status: 500,
        })
    }

    const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userID: user.id,
        userName: user.username,
        attestationType: 'none',
        authenticatorSelection: {
            residentKey: 'required',
            userVerification: 'preferred',
        },
    });

    try {
        await setUserCurrentChallenge(user.id, options.challenge)
    } catch (e) {
        let err = e as Error
        return new NextResponse(`set challenge failed: ${err.message}`, {
            status: 500,
        })
    }

    return NextResponse.json(options);
}

async function getUserFromDB(username: string) {
    return await db.insertInto('User')
        .values({
            username: username,
        })
        .onConflict((oc) => oc
            .column('username')
            .doUpdateSet({ username: username })
        )
        .returningAll()
        .executeTakeFirstOrThrow()
}

async function setUserCurrentChallenge(userId: string, challenge: string) {
    return await db
        .insertInto('Challenge')
        .values({
            content: challenge,
            userId: userId,
        })
        .onConflict((oc) => oc
            .column('userId')
            .doUpdateSet({ content: challenge })
        )
        .executeTakeFirstOrThrow()
}
