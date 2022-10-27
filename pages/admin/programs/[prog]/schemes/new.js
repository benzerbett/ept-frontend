import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function NewScheme() {
  const router = useRouter()
  const {prog} = router.query
  return (
    <>
      <Head>
        <title>EPT | New Scheme</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>NewScheme Program:{prog}</div>
    </>
  )
}

export default NewScheme