import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function ViewSurvey() {
  const router = useRouter()
  const {survey} = router.query
  return (
    <>
      <Head>
        <title>EPT | View Survey Form</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewSurvey {survey}</div>
    </>
  )
}

export default ViewSurvey