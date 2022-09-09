import AppNavbar from '../common/AppNavbar'
import AppFooter from '../common/AppFooter'

export default function DefaultAppTheme({ children }) {
  return (
    <>
      <AppNavbar />
      <main>{children}</main>
      <AppFooter />
    </>
  )
}