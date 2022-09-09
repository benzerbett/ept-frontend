import AppNavbar from '../common/AppNavbar'
import AppFooter from '../common/AppFooter'

export default function DefaultAppTheme({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '97vh' }}>
      <AppNavbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </main>
      <AppFooter />
    </div>
  )
}