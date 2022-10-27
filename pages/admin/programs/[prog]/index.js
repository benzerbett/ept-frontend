import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function ViewProgram() {
  const router = useRouter()
  const {prog} = router.query
  return (
    <>
      <Head>
        <title>EPT | View Program</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewProgram {prog}</div>
    </>
  )
}

export default ViewProgram