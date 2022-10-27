import Head from 'next/head'
import React from 'react'

function NewRound() {
  const router = useRouter();
  const {prog} = router.query;
  return (
    <>
      <Head>
        <title>EPT | New Round</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>NewRound Program:{prog}</div>
    </>
  )
}

export default NewRound