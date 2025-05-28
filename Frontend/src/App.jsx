import { Outlet } from 'react-router-dom'
import Footer from './Component/Footer'
import Header from './Component/Header'

function App() {
  return <>
  <Header />
  <Outlet />
  <Footer />
  </>
}

export default App
