import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function Reports() {
  const router = useRouter()
  const {prog} = router.query 
  return (
    <>
      <Head>
        <title>EPT | Reports</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Reports Program:{prog}</div>
    </>
  )
}

export default Reports