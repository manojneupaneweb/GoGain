import { Outlet } from 'react-router-dom'
import Footer from './Component/Footer'
import Header from './Component/Header'
import { CartProvider } from './utils/CartContext.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
