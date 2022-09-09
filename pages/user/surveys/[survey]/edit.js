import Head from 'next/head'
import React from 'react'

function SurveyForm({ survey }) {
  return (
    <>
      <Head>
        <title>EPT | Edit Survey Form Entry</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Edit Survey Entry {survey}</div>
    </>
  )
}

export default SurveyForm