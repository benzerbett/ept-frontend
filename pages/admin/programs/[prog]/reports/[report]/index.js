import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function ViewReport() {
  const router = useRouter()
  const {prog, report} = router.query
  return (
    <>
      <Head>
        <title>EPT | View Report</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewReport Program:{prog}, Report:{report}</div>
    </>
  )
}

export default ViewReport