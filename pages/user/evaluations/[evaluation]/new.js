import React, { useEffect, useState } from "react";
import { doGetSession, getProgramConfig, loadConfig, renderField } from '../../../../utilities'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from "next/head";

import { Form } from "../../../../components/form/Form";

function App() {
    const router = useRouter();
    const { evaluation } = router.query

    const [form, setForm] = useState({});
    const [formId, setFormId] = useState(router.query.evaluation || null);
    const [loading, setLoading] = useState(true);

    const getForm = async (sess, config, form_id) => {
        if (config) {
            let fm = loadConfig(config, sess);
            if (fm) {
                return fm.forms.find(frm => frm.code === form_id)
            } else {
                return 'fm'
            }
        } else {
            return null
        }
    }

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            doGetSession().then(session => {
                if (session) {
                    const ap = getProgramConfig(session.activeProgramCode)
                    ap.then((configuration) => {
                        const { evaluation } = router.query
                        if (evaluation) {
                            setFormId(evaluation);
                            getForm(session, configuration, evaluation).then(fm => {
                                if (fm) {
                                    setForm(fm);
                                    setLoading(false);
                                } else {
                                    console.log("form not found");
                                }
                            })
                            setLoading(false)
                        } else {
                            setFormId(null);
                            setForm(null);
                            setLoading(false)
                        }
                    })
                } else {
                    setLoading(true)
                }
            })
        }
        return () => mounted = false;
    }, [evaluation])

    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    if (!form || !form.sections || form.sections.length === 0) {
        return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">Form not found</h4>
                <hr />
                <p className="mb-0">Form with code <strong>{formId}</strong> not found or is empty. Please refresh the page and try again.</p>
                <p className="mb-0">If the problem persists, please contact the administrator.</p>
            </div>
        </main>
    }

    return (<>
        <Head>
            <title>EPT | Fill Evaluation - {formId}</title>
            <meta name="description" content="EPT" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <section>
            <div className="container">
                {formId ? <article style={{ padding: '10px 15px' }}>
                    <Form form={form} />
                </article> : <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h5 className='mb-0'>Loading...</h5>
                </main>}
            </div>
        </section>
    </>
    );
}


export default App;
