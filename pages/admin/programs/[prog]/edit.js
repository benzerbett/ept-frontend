import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import ProgramsNavbar from '../../../../components/common/ProgramsNavbar'

function ProgramForm() {
    const router = useRouter()
    const { prog } = router.query
    return (
        <>
            <Head>
                <title>EPT | Edit Program</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container p-0'>
                <ProgramsNavbar router={router} />
                <div className='row mt-5'>
                    <div className='col-md-12'>
                        EditProgram {prog}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProgramForm