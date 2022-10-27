import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function NewReport() {
  const router = useRouter()
  const {prog} = router.query
  return (
    <>
      <Head>
        <title>EPT | New Report</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>NewReport Program:{prog}</div>
    </>
  )
}

export default NewReport