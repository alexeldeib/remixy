'use client';

import { startRegistration } from '@simplewebauthn/browser'

export default function Signup() {
  const handleSubmit = () => {
    if (
      typeof window.PublicKeyCredential !== 'undefined'
      && typeof window.PublicKeyCredential.isConditionalMediationAvailable === 'function'
    ) {
      PublicKeyCredential
        .isConditionalMediationAvailable()
        .then(available => {
          if (!available) {
            return Promise.reject("failed to resolve mediation available")
          }
        })
        .then(() => fetch('http://localhost:3000/api/signup')
          .then(res => res.json())
          .then(options => {
            startRegistration(options)
              .then(authResp => {
                fetch('http://localhost:3000/api/verify', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(authResp),
                })
              }).catch(err => {
                console.error('Error with conditional UI:', err);
              })
          })
          // .then(authOptions => {
          //   let challenge: string = authOptions.challenge
          //   return {
          //     ...authOptions,
          //     challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
          //   }
          // })
          // .then(authOptions => {
          //   console.log(authOptions)
          //   navigator.credentials.create({
          //     publicKey: {
          //       ...authOptions,
          //     }
          //   });
          // })
          // .then(webAuthnResponse => {
          //   console.log(`webauthn response: ${webAuthnResponse}`)
          //   fetch('http://localhost:3000/api/verify', {
          //     method: 'POST',
          //     headers: {
          //       'Content-Type': 'application/json',
          //     },
          //     body: JSON.stringify(webAuthnResponse),
          //   })
          // }).catch(err => {
          //   console.error('Error with conditional UI:', err);
          // })
        ).catch(err => {
          console.error('Error with conditional UI:', err);
        });
    }
  }

  return (
    <>
      <form>
        <label htmlFor="username">Username:</label>
        <input name="username" id="loginform.username" autoComplete="username webauthn" />
        <button type="button" onClick={handleSubmit}>Register</button>
      </form>
      <div>
      </div>
    </>
  )
}
