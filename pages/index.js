import Head from 'next/head'
import { useState } from 'react'
import axios from '../axios'
import localStorage from '../localStorage'
import Link from 'next/link'
import Loader from '../components/Loader'
import { toast, ToastContainer } from 'react-toastify';
import { useCookies } from "react-cookie"
import { parseCookies } from "../helper/cookiedHelper"
import Router from 'next/router'


export default function Home({userToken}) {

  const [cookie, setCookie] = useCookies(["userToken"])

  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState(false)
  const [phoneErrorMsg, setPhoneErrorMsg] = useState('')

  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)
  const [otpErrorMsg, setOtpErrorMsg] = useState('')

  const [showOtp, setShowOtp] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const phoneHandler = (text) =>{
    setPhone(text) 
    if (text == '') {
      setPhoneError(true) 
      setPhoneErrorMsg('Please enter a phone number') 
      return;
    } else if (!(/^[0-9\s]*$/.test(text)) || text.length > 10 || text.length < 10) {
      setPhoneError(true)
      setPhoneErrorMsg('please enter a valid phone number')  
      return;
    } else {
      setPhoneError(false)
      setPhoneErrorMsg('')  
    }
  }

  const otpHandler = (text) =>{
    setOtp(text)
    if (text == '') {
      setOtpError(true) 
      setOtpErrorMsg('please enter an otp') 
      return;
    } else if (!(/^[0-9\s]*$/.test(text)) || text.length > 4 || text.length < 4) {
      setOtpError(true) 
      setOtpErrorMsg('please enter a valid otp') 
      return;
    } else {
      setOtpError(false) 
      setOtpErrorMsg('') 
    }
  }

  const sendOtp = () => {
    if (phone == '') {
      setPhoneError(true) 
      setPhoneErrorMsg('Please enter a phone number')  
      return;
    }
    if(phoneError){
      setPhoneError(true) 
      setPhoneErrorMsg('Please enter a phone number') 
      return;
    }
    
    const formData = new FormData();
    formData.append('phone',phone);
    setShowLoader(true)
    axios.post('/auth/send-otp',formData)
    .then(res => {
      setShowLoader(false)
      setShowOtp(true)
      // console.log(res);
      toast.success(res?.data?.data, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        toastId: new Date()
      });
    })
    .catch(err => {
      setShowLoader(false)
      // console.log(err.response)
      toast.error(err?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        toastId: new Date()
      });
      
    })
    setPhoneError(false)
    setPhoneErrorMsg('')
  }

  const login = (e) => {
    e.preventDefault()

    if (otp == '') {
      setOtpError(true) 
      setOtpErrorMsg('Please enter an otp') 
      return;
    }
    if(otpError){
      setOtpError(true) 
      setOtpErrorMsg('Please enter an otp') 
      return;
    }
    if(phoneError){
      setPhoneError(true) 
      setPhoneErrorMsg('Please enter a phone number')
      return;
    }
    
    const formData = new FormData();
    formData.append('phone',phone);
    formData.append('otp',otp);
    setShowLoader(true)
    axios.post('/auth/login',formData)
    .then(res => {
      setShowLoader(false)
      // console.log(res.data.data);
      setShowOtp(false)
      toast.success('Loggedin Successfully.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        toastId: new Date()
      });
      const token = res.data.data.token;
      const user = res.data.data.user;
      setCookie("userToken", JSON.stringify(token), {
        path: "/",
        maxAge: 3600, // Expires after 1hr
        sameSite: true,
      })

      localStorage.storeUser(token,user);
      Router.push('/products')

      setPhone('')
      setOtp('')
    })
    .catch(err => {
      setShowLoader(false)
      // console.log(err);
      toast.error(err?.response?.data?.data, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        toastId: new Date()
      });
    })
    setOtpError(false)
  }


  return (
    <div className=''>
      <Head>
        <title>Cotton Culture</title>
      </Head>
      <main id="main-app">
        {showLoader?<Loader />:null}
        <div id="main-wrapper">

          <div className="gray py-3">
            <div className="container">
              <div className="row align-items-start justify-center">
                <div className="colxl-12 col-sm-8 col-md-6 col-lg-3 text-center">
                  <a className="nav-brand" href="#">
                    <img src="/img/logo.png" className="logo" alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <section className="middle">
            <div className="container">
              <div className="row align-items-start justify-center">

                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <h1 className="mb-3 ft-bold lg-heading text-center">Login</h1>
                  <form className="border p-3 rounded" >
                    {!showOtp ? <div className="form-group">
                      <label>Phone Number *</label>
                      <input type="text" className="form-control" name="phone" placeholder="Phone Number*" value={phone} onChange={(e)=>phoneHandler(e.target.value)} />
                      {phoneError ? <i style={{ color: 'red' }}>{phoneErrorMsg}</i>:null}
                    </div>:null}

                    {!showOtp ? <div className="form-group">
                      <div className="d-flex align-items-center justify-content-between">
                        <Link href="/register" className="flex-1">
                          <a>Register</a>
                        </Link>
                        <div className="eltio_k2">
                          <a href="#" onClick={sendOtp}>Send OTP</a>
                        </div>
                      </div>
                    </div>:null}

                    {showOtp ? <div className="form-group">
                      <label>OTP *</label>
                      <input type="password" name="otp" className="form-control" placeholder="OTP*" value={otp} onChange={(e)=>otpHandler(e.target.value)} />
                      {otpError ? <i style={{ color: 'red' }}>{otpErrorMsg}</i>:null}
                    </div>:null}

                    {showOtp ? <div className="form-group">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="flex-1">

                        </div>
                        <Link href="/register" className="eltio_k2">
                          <a>Register</a>
                        </Link>
                      </div>
                    </div>:null}

                    {showOtp ? <div className="form-group">
                      <button onClick={(e)=>login(e)} className="btn btn-md full-width bg-dark text-light fs-md ft-medium">Login</button>
                    </div>:null}
                  </form>
                </div>



              </div>
            </div>
          </section>

        </div>
        <ToastContainer />
      </main >

    </div >
  )
}

export async function getServerSideProps(context) {

  const data = parseCookies(context.req)

    if(data?.userToken!=undefined){
      return {
        redirect: {
          permanent: false,
          destination: "/products"
        }
    }
    
  }

  return {
        props: {
            userToken: data && data,
        }, // will be passed to the page component as props
    }
}
