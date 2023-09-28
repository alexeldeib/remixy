import { NextResponse } from 'next/server';
import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import type { AuthenticatorTransportFuture } from '@simplewebauthn/typescript-types';

import { db } from '@/lib/db'
import { expectedOrigin, rpID } from '@/lib/webauthn'

export async function GET(req: Request) {
    const user = await getUserFromDB('ace')
    if (!user) {
        return new NextResponse('no user found', {
            status: 400,
        })
    }

    const authenticators: { 
        credentialId: Buffer
        publicKey: Buffer
        counter: string
        transports: string | null
    }[] = await getUserAuthenticators(user.id)
    
    const options = await generateAuthenticationOptions({
        // Require users to use a previously-registered authenticator
        allowCredentials: authenticators.map(authenticator => ({
          id: authenticator.credentialId,
          type: 'public-key',
          // Optional
          transports: authenticator.transports?.split(',').map(e => e as AuthenticatorTransportFuture),
        })),
        userVerification: 'preferred',
      });
      

    await setUserCurrentChallenge(user.id, options.challenge)

    return NextResponse.json(options);
}

export async function POST(req: Request) {
    const body = await req.json()

    const user = await getUserFromDB('ace')
    if (!user) {
        return new NextResponse('no user found', {
            status: 400,
        })
    }

    const currentChallenge = (await getUserCurrentChallenge(user.id));
    if (!currentChallenge) {
        return new NextResponse('no challenge found', {
            status: 400,
        })
    }

    const expectedChallenge = currentChallenge.content
    
    let allAuthenticators = await getUserAuthenticators(user.id)
    let testAuths = allAuthenticators.map((a) => {
        return {
            credentialId: a.credentialId.toString('base64'),
        }
    })

    console.log(`found authenticators: ${JSON.stringify(testAuths)}`)

    const authenticator = await getUserAuthenticator(user.id, body.id);

    if (!authenticator) {
        return new NextResponse('no authenticator found', {
            status: 400,
        })
    }

    let authenticatorOpt = {
        credentialID: authenticator.credentialID,
        credentialPublicKey: authenticator.credentialPublicKey,
        counter: parseInt(authenticator.counter),
        transports: authenticator.transports?.split(',').map(e => e as AuthenticatorTransportFuture),
    }

    const verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: expectedOrigin,
        expectedRPID: rpID,
        authenticator: authenticatorOpt,
        requireUserVerification: true,
    })

    const { authenticationInfo, verified } = verification;
    const { newCounter } = authenticationInfo;

    if (verified) {
        await saveUpdatedAuthenticatorCounter(authenticator.credentialPublicKey, newCounter)
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
        .executeTakeFirst()
}

async function getUserAuthenticators(userId: string) {
    return await db
        .selectFrom('Authenticator')
        .select(['credentialId', 'counter', 'publicKey', 'transports'])
        .where('userId', '=', userId)
        .execute()
}

async function getUserAuthenticator(userId: string, credentialId: Buffer) {
    return await db
        .selectFrom('Authenticator')
        .select(['credentialId as credentialID', 'counter', 'publicKey as credentialPublicKey', 'transports'])
        .where('credentialId', '=', Buffer.from(credentialId.toString(), 'base64'))
        .where('userId', '=', userId)
        .executeTakeFirst()
}

async function getUserCurrentChallenge(userId: string) {
    return await db
        .selectFrom('Challenge')
        .select(['content'])
        .where('userId', '=', userId)
        .executeTakeFirst()
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
        .executeTakeFirst()
}

async function saveUpdatedAuthenticatorCounter(credentialId: Buffer, counter: number) {
    return await db
        .updateTable('Authenticator')
        .where('credentialId', '=', credentialId)
        .set({
            counter: counter.toString(),
        })
        .executeTakeFirst()
}