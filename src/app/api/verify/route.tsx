import { NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';

import { db } from '@/lib/db'
import { expectedOrigin, rpID } from '@/lib/webauthn'

export async function POST(req: Request) {
    const body = await req.json();

    let user
    try {
        user = await getUserFromDB('ace')
    } catch (e) {
        let err = e as Error
        return new NextResponse(`verify failed - no user - ${err.message}`, {
            status: 500,
        })
    }

    const expectedChallenge = (await getUserCurrentChallenge(user.id)).content;

    let verification;
    try {
        verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: expectedOrigin,
            expectedRPID: rpID,
            requireUserVerification: true,
        });
    } catch (e) {
        console.error(e);
        let err = e as Error
        return new NextResponse(`verification failed - ${err.message}`, {
            status: 500,
        })
    }

    const { verified } = verification;

    if (verified) {
        try {
            await saveNewUserAuthenticatorInDB(user.id, Buffer.from(verification.registrationInfo?.credentialID!), Buffer.from(verification.registrationInfo?.credentialPublicKey.buffer!), verification.registrationInfo?.counter.toString()!)
        } catch(e) {
            console.error(e);
            let err = e as Error
            return new NextResponse(`verification failed - saving authenticator to db - ${err.message}`, {
                status: 500,
            })
        }
    }


    return NextResponse.json({ verified });
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

async function getUserCurrentChallenge(userId: string) {
    return await db
        .selectFrom('Challenge')
        .select(['content'])
        .where('userId', '=', userId)
        .executeTakeFirstOrThrow()
}

async function saveNewUserAuthenticatorInDB(userId: string, credentialId: Buffer, credentialPublicKey: Buffer, counter: string) {
    return await db
        .insertInto('Authenticator')
        .values({
            userId: userId,
            credentialId: credentialId,
            counter: counter,
            publicKey: credentialPublicKey,
        })
        .executeTakeFirstOrThrow()
}