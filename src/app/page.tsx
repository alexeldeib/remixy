// 'use client';
export default function Home() {
  return (
    <div className='grid grid-cols-5 grid-rows-5 place-items-center align-middle text-center'>
      <header className='col-span-5 row-span-1 place-self-stretch flex flex-row justify-between items-center'>
        <div className='flex-grow'>Home</div>
        <div className='flex-grow'></div>
        <div className='flex-grow'>Baz</div>
      </header>
      <main className='col-span-5 row-span-4 place-self-stretch m-auto'>
        main!
        <form>
          <input name='username' id='login-username' autoComplete='webauthn'></input>
          <input name='password' id='password' type='password' autoComplete='current-password webauthn'></input>
        </form>
      </main>
      <footer className='col-span-5 row-span-1 place-self-stretch flex flex-row justify-between items-center'>
        <div className='flex-grow'>Foo</div>
        <div className='flex-grow'>Bar</div>
        <div className='flex-grow'>Baz</div>
      </footer>
    </div>
  )
}

// import { startAuthentication, startRegistration } from '@simplewebauthn/browser'

// export default function Home() {
//   const handleSubmit = () => {
//     if (
//       typeof window.PublicKeyCredential !== 'undefined'
//       && typeof window.PublicKeyCredential.isConditionalMediationAvailable === 'function'
//     ) {
//       PublicKeyCredential
//         .isConditionalMediationAvailable()
//         .then(available => {
//           if (!available) {
//             return Promise.reject("failed to resolve mediation available")
//           }
//         })
//         .then(() => fetch('http://localhost:3000/api/signup')
//           .then(res => res.json())
//           .then(options => {
//             startRegistration(options)
//               .then(authResp => {
//                 fetch('http://localhost:3000/api/verify', {
//                   method: 'POST',
//                   headers: {
//                     'Content-Type': 'application/json',
//                   },
//                   body: JSON.stringify(authResp),
//                 })
//               }).catch(err => {
//                 console.error('Error with conditional UI:', err);
//               })
//           })
//           // .then(authOptions => {
//           //   let challenge: string = authOptions.challenge
//           //   return {
//           //     ...authOptions,
//           //     challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
//           //   }
//           // })
//           // .then(authOptions => {
//           //   console.log(authOptions)
//           //   navigator.credentials.create({
//           //     publicKey: {
//           //       ...authOptions,
//           //     }
//           //   });
//           // })
//           // .then(webAuthnResponse => {
//           //   console.log(`webauthn response: ${webAuthnResponse}`)
//           //   fetch('http://localhost:3000/api/verify', {
//           //     method: 'POST',
//           //     headers: {
//           //       'Content-Type': 'application/json',
//           //     },
//           //     body: JSON.stringify(webAuthnResponse),
//           //   })
//           // }).catch(err => {
//           //   console.error('Error with conditional UI:', err);
//           // })
//         ).catch(err => {
//           console.error('Error with conditional UI:', err);
//         });
//     }
//   }

//   return (
//     <>
//       <form>
//         <label htmlFor="username">Username:</label>
//         <input name="username" id="loginform.username" autoComplete="username webauthn" />
//         <button type="button" onClick={handleSubmit}>Register</button>
//       </form>
//       <div>
//       </div>
//     </>
//   )
// }
