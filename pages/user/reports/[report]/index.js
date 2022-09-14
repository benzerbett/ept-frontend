import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function ViewReport() {
  const router = useRouter()
  const {report} = router.query
  return (
    <>
      <Head>
        <title>EPT | ViewReport</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewReport {report}</div>
    </>
  )
}

export default ViewReport