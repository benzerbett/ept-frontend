import Head from 'next/head'
import React from 'react'

function ViewSurvey({ survey }) {
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