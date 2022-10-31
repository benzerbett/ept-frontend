import React from 'react'

function Pagination({page, lastPage, totalRecords, count, perPage, pageLinks, setPage}) {
    return (
        <div className='col-md-12'>
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-between align-items-center">
                <nav aria-label='Pagination'>
                    <ul className="pagination">
                        {pageLinks.map((link, index) => (
                            <li key={index} className={`page-item ${link.active ? 'active' : ''}`}>
                                <button className="page-link" onClick={ev => {
                                    ev.preventDefault(); ev.stopPropagation();
                                    if (link.url) {
                                        setPage(link.url.split('page=')[1])
                                    }
                                }}>
                                    {link.label.split(' ').filter(w => !w.includes('&')).join(' ')}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className='d-flex align-items-end flex-column justify-content-center'>
                    <small>Showing {page} of {lastPage} pages</small>
                    <small className="text-muted">{count} of {totalRecords} items</small>
                </div>
            </div>
        </div>
    )
}

export default Pagination