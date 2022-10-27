import Head from 'next/head'
import { useRouter } from 'next/router';
import React from 'react'

function Schemes() {
  const router = useRouter();
  const {prog} = router.query;
  return (
    <>
      <Head>
        <title>EPT | Schemes</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Schemes Program:{prog}</div>
    </>
  )
}

export default Schemes