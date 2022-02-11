import Header from '../Header'
import Footer from '../Footer'
import { ToastContainer } from 'react-toastify';
import Cart from '../Cart'

export default function Index({cartSection,userToken,children}) {
  return <main>
      <div id="main-wrapper">
      <Header  cartSection={cartSection} userToken={userToken} />
        {children}
        <Cart cartSection={cartSection} userToken={userToken} />
        <ToastContainer />
        <Footer />
      </div>
  </main>;
}
