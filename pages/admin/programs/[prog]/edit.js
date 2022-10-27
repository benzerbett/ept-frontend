import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function ProgramForm() {
  const router = useRouter()
  const {prog} = router.query
  return (
    <>
      <Head>
        <title>EPT | Edit Program</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>EditProgram {prog}</div>
    </>
  )
}

export default ProgramForm