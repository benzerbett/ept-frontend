import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function EditScheme() {
  const router = useRouter()
  const {prog, scheme} = router.query
  return (
    <>
      <Head>
        <title>EPT | Edit Scheme</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>EditScheme Program:{prog}, Scheme:{scheme}</div>
    </>
  )
}

export default EditScheme