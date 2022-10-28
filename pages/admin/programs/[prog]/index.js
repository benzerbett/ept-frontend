import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import ProgramsNavbar from '../../../../components/common/ProgramsNavbar'

function ViewProgram() {
    const router = useRouter()
    const { prog } = router.query
    return (
        <>
            <Head>
                <title>EPT | View Program</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container p-0'>
                <ProgramsNavbar router={router} />
                <div className='row mt-5'>
                    <div className='col-md-12'>
                        ViewProgram {prog}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewProgram