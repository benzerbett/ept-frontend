import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function EditForm() {
  const router = useRouter()
  const {form} = router.query
  return (
    <>
      <Head>
        <title>EPT | Edit Form</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>EditForm {form}</div>
    </>
  )
}

export default EditForm