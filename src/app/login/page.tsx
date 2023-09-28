'use client';

import { startAuthentication } from '@simplewebauthn/browser'

export default function Login() {
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
        .then(() => fetch('http://localhost:3000/api/authopts')
        .then(res => res.json())
        .then(options => startAuthentication(options, true))            
        .then(authResp => {
          fetch('http://localhost:3000/api/authopts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(authResp),
          })
        }).catch(err => {
          console.error('Error with conditional UI:', err);
        }))
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
    }
  }

  return (
    <>
      <form>
        <input name="username" id="login-username" autoComplete="webauthn username"/>
        <button type="button" onClick={handleSubmit}>Login</button>
      </form>
    </>
  )
}
