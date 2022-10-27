import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function ViewScheme() {
  const router = useRouter()
  const {prog, scheme} = router.query
  return (
    <>
      <Head>
        <title>EPT | View Scheme</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewScheme Program:{prog}, Scheme:{scheme}</div>
    </>
  )
}

export default ViewScheme