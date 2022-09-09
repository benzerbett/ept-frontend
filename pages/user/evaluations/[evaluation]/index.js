import Head from 'next/head'
import React from 'react'

function ViewEvaluation({ evaluation }) {
  return (
    <>
      <Head>
        <title>EPT | ViewEvaluation</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewEvaluation {evaluation}</div>
    </>
  )
}

export default ViewEvaluation