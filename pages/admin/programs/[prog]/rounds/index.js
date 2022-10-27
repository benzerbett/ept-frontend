import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function Rounds() {
  const router = useRouter();
  const {prog} = router.query;
  return (
    <>
      <Head>
        <title>EPT | Rounds</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Rounds Program:{prog}</div>
    </>
  )
}

export default Rounds