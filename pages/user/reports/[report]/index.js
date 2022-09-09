import Head from 'next/head'
import React from 'react'

function ViewReport({report}) {
  return (
    <>
      <Head>
        <title>EPT | ViewReport</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewReport {report}</div>
    </>
  )
}

export default ViewReport