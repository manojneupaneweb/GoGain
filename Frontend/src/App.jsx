import { Outlet } from 'react-router-dom'
import Footer from './Component/Footer'
import Header from './Component/Header'
import { CartProvider } from './utils/CartContext'

function App() {
  return <>
    <CartProvider>
      <Header />
      <Outlet />
      <Footer />
    </CartProvider>
  </>
}

export default App
