import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import ProgramsNavbar from '../../../../../../components/common/ProgramsNavbar'

function ViewReport() {
    const router = useRouter()
    const { prog, report } = router.query
    return (
        <>
            <Head>
                <title>EPT | View Report</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container p-0'>
                <ProgramsNavbar router={router} />
                <div className='row mt-5'>
                    <div className='col-md-12'>
                        ViewReport Program:{prog}, Report:{report}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewReport