import React from 'react'

function PublicFooter() {
    return (
        <footer className="footer mt-auto py-3 bg-light">
            <div className="container text-end d-flex justify-content-between">
                <small className="text-muted">
                    Ministry of Health &middot; Department of Laboratory Services
                </small>
                <small className="text-muted">
                    &copy; {new Date().getFullYear()}{' '}
                </small>
            </div>
        </footer>
    )
}

export default PublicFooter