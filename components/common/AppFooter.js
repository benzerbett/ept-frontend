import React from 'react'

function AppFooter() {
  return (
    <footer style={{ background: '#ccc', padding: '1rem' }}>
      <p>
        &copy; {new Date().getFullYear()}{' '}
      </p>
    </footer>
  )
}

export default AppFooter