import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function EditReport() {
  const router = useRouter()
  const {prog, report} = router.query
  return (
    <>
      <Head>
        <title>EPT | Edit Report</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>EditReport Program:{prog}, Report:{report}</div>
    </>
  )
}

export default EditReport