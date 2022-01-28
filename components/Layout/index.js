import Header from '../Header'
import Footer from '../Footer'

export default function index({children}) {
  return <main>
      <div id="main-wrapper">
      <Header />
        {children}
        <Footer />
      </div>
  </main>;
}
