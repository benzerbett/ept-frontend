import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function SurveyForm() {
  const router = useRouter()
  const {survey} = router.query
  return (
    <>
      <Head>
        <title>EPT | Edit Survey Form Entry</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Edit Survey Entry {survey} Submission {submission}</div>
    </>
  )
}

export default SurveyForm