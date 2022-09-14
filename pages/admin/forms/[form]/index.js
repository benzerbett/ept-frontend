import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function ViewForm() {
  const router = useRouter()
  const {form} = router.query
  return (
    <>
      <Head>
        <title>EPT | View Form</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewForm {form}</div>
    </>
  )
}

export default ViewForm