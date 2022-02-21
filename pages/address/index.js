import Head from 'next/head'
import Layout from '../../components/Layout'
import { useState, useEffect, useRef } from 'react'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/Breadcrumb'
import AddressModal from '../../components/AddressModal'
import { toast } from 'react-toastify';
import axios from '../../axios'
import useSWR from 'swr'
import constant from '../../constant'
import { parseCookies } from "../../helper/cookiedHelper"
import { useCookies } from "react-cookie"
import Router from 'next/router'


export default function Address({userToken}) {

  const [showLoader, setShowLoader] = useState(true)
  const [address, setAddress] = useState([])

  const modalCloseBtn = useRef(null);
  const cartSection = useRef(null);

  const [cookies, setCookie, removeCookie] = useCookies(["userToken"])

  const [label, setLabel] = useState('')
  const [labelError, setLabelError] = useState(false)
  const [labelErrorMsg, setLabelErrorMsg] = useState('')

  const [addressInput, setAddressInput] = useState('')
  const [addressInputError, setAddressInputError] = useState(false)
  const [addressInputErrorMsg, setAddressInputErrorMsg] = useState('')

  const [city, setCity] = useState('')
  const [cityError, setCityError] = useState(false)
  const [cityErrorMsg, setCityErrorMsg] = useState('')

  const [state, setState] = useState('')
  const [stateError, setStateError] = useState(false)
  const [stateErrorMsg, setStateErrorMsg] = useState('')

  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinErrorMsg, setPinErrorMsg] = useState('')



  const fetcher = (...args) => fetch(...args, {
    headers: {
      'authorization': 'bearer ' + JSON.parse(userToken.userToken),
    },
  }).then((res) => res.json())

  const { data: addressData, error: addressError } = useSWR(`${constant.api_route}/get-address`, fetcher)




  useEffect(() => {
    if (addressError) {
      // console.log(addressError);
      toast.error('Something went wrong. Please refresh the page', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        toastId: new Date()
      });
    }

    return () => { };
  }, [addressError]);

  useEffect(() => {
    if (!addressData) {
      setShowLoader(true)
    } else {
      setShowLoader(false)
      // console.log(addressData?.message)
      if(addressData?.message=='Token is Invalid' || addressData?.message=='Token is Expired' || addressData?.message=='Authorization Token not found'){
        removeCookie("userToken");
        Router.push('/')
      }
      setAddress(addressData?.data?.address)
    }

    return () => { };
  }, [addressData]);


  const labelHandler = (text) => {
    setLabel(text)
    if (text == '') {
      setLabelError(true)
      setLabelErrorMsg('Please enter a label')
      return;
    } else if (!(/^[a-zA-Z\s]*$/.test(text))) {
      setLabelError(true)
      setLabelErrorMsg('please enter a valid label')
      return;
    } else {
      setLabelError(false)
      setLabelErrorMsg('')
    }
  }

  const cityHandler = (text) => {
    setCity(text)
    if (text == '') {
      setCityError(true)
      setCityErrorMsg('Please enter a city')
      return;
    } else if (!(/^[a-zA-Z\s]*$/.test(text))) {
      setCityError(true)
      setCityErrorMsg('please enter a valid city')
      return;
    } else {
      setCityError(false)
      setCityErrorMsg('')
    }
  }

  const stateHandler = (text) => {
    setState(text)
    if (text == '') {
      setStateError(true)
      setStateErrorMsg('Please enter a state')
      return;
    } else if (!(/^[a-zA-Z\s]*$/.test(text))) {
      setStateError(true)
      setStateErrorMsg('please enter a valid state')
      return;
    } else {
      setStateError(false)
      setStateErrorMsg('')
    }
  }

  const pinHandler = (text) => {
    setPin(text)
    if (text == '') {
      setPinError(true)
      setPinErrorMsg('Please enter a pin')
      return;
    } else if (!(/^[0-9\s]*$/.test(text)) || text.length > 6 || text.length < 6) {
      setPinError(true)
      setPinErrorMsg('please enter a valid pin')
      return;
    } else {
      setPinError(false)
      setPinErrorMsg('')
    }
  }

  const addressInputHandler = (text) => {
    setAddressInput(text)
    if (text == '') {
      setAddressInputError(true)
      setAddressInputErrorMsg('Please enter a address')
      return;
    } else if (!(/^[a-z 0-9~%.:_\@\-\/\&+=,]+$/i.test(text))) {
      setAddressInputError(true)
      setAddressInputErrorMsg('please enter a valid address')
      return;
    } else {
      setAddressInputError(false)
      setAddressInputErrorMsg('')
    }
  }


  const addAddressHandler = async (e) => {
    e.preventDefault()

    if (label == '') {
      setLabelError(true)
      setLabelErrorMsg('Please enter a label')
      return;
    }

    if (addressInput == '') {
      setAddressInputError(true)
      setAddressInputErrorMsg('Please enter a address')
      return;
    }

    if (city == '') {
      setCityError(true)
      setCityErrorMsg('Please enter a city')
      return;
    }

    if (state == '') {
      setStateError(true)
      setStateErrorMsg('Please enter a state')
      return;
    }

    if (pin == '') {
      setPinError(true)
      setPinErrorMsg('Please enter a pin')
      return;
    }

    if (labelError) {
      setLabelError(true)
      setLabelErrorMsg('Please enter a label')
      return;
    }

    if (addressInputError) {
      setAddressInputError(true)
      setAddressInputErrorMsg('Please enter a address')
      return;
    }

    if (cityError) {
      setCityError(true)
      setCityErrorMsg('Please enter a city')
      return;
    }

    if (pinError) {
      setPinError(true)
      setPinErrorMsg('Please enter a pin')
      return;
    }

    if (stateError) {
      setStateError(true)
      setStateErrorMsg('Please enter a state')
      return;
    }

    const formData = new FormData();
    formData.append('address', addressInput);
    formData.append('city', city);
    formData.append('label', label);
    formData.append('state', state);
    formData.append('pincode', pin);
    formData.append('latitude', '12345');
    formData.append('longitude', '12345');
    setShowLoader(true)

    axios.post('/save-address', formData, {
      headers: {
        'authorization': 'bearer ' + JSON.parse(userToken.userToken),
      },
    })
      .then(res => {
        setShowLoader(false)
        // console.log(res);
        getAddressDataHandler()
        toast.success('Added Successfully.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          toastId: new Date()
        });
        setLabel('')
        setAddressInput('')
        setCity('')
        setState('')
        setPin('')
        modalCloseBtn.current.click();
      })
      .catch(err => {
        setShowLoader(false)
        console.log(err);
        if(err?.response?.data?.message=='Token is Invalid' || err?.response?.data?.message=='Token is Expired' || err?.response?.data?.message=='Authorization Token not found'){
          removeCookie("userToken");
          Router.push('/')
        }
        toast.error(err?.response?.data?.data, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          toastId: new Date()
        });

      })
    setLabelError(false)
    setLabelErrorMsg('')
    setCityError(false)
    setCityErrorMsg('')
    setStateError(false)
    setStateErrorMsg('')
    setPinError(false)
    setPinErrorMsg('')
    setAddressInputError(false)
    setAddressInputErrorMsg('')

  }

  const getAddressDataHandler = () => {
    setShowLoader(true)
    setAddress([])
    axios.get('/get-address', {
      headers: {
        'authorization': 'bearer ' + JSON.parse(userToken.userToken),
      },
    })
      .then(res => {
        setShowLoader(false)
        // console.log(res);
        setAddress(res?.data?.data?.address)
      })
      .catch(err => {
        setShowLoader(false)
        console.log(err);
        if(err?.response?.data?.message=='Token is Invalid' || err?.response?.data?.message=='Token is Expired' || err?.response?.data?.message=='Authorization Token not found'){
          removeCookie("userToken");
          Router.push('/')
        }
        toast.error(err?.response?.data?.data, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          toastId: new Date()
        });

      })
  }

  const deleteAddressDataHandler = (id) => {
    setShowLoader(true)
    axios.get(`/delete-address/${id}`, {
      headers: {
        'authorization': 'bearer ' + JSON.parse(userToken.userToken),
      },
    })
      .then(res => {
        setShowLoader(false)
        getAddressDataHandler()
      })
      .catch(err => {
        setShowLoader(false)
        console.log(err);
        if(err?.response?.data?.message=='Token is Invalid' || err?.response?.data?.message=='Token is Expired' || err?.response?.data?.message=='Authorization Token not found'){
          removeCookie("userToken");
          Router.push('/')
        }
        toast.error(err?.response?.data?.data, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          toastId: new Date()
        });

      })
  }






  return (
    <Layout cartSection={cartSection} userToken={userToken}>
      <Head>
        <title>Cotton Culture</title>
      </Head>
      {showLoader ? <Loader /> : null}
      <Breadcrumb link="Address" />

      <section className="middle" id="prduct">
        <div className="container">

          <div className="form-group">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="ft-bold mb-1">Address</h2>
              <div className="eltio_k2">
                <a href="#" data-toggle="modal" data-target="#address1" className="btn btn-block custom-height bg-dark mb-2">
                  <i className="fas fa-map-marked-alt mr-2"></i>Add Address
                </a>
              </div>
            </div>
            <hr />
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr className="table-dark">
                <th scope="col">#</th>
                <th scope="col">Label</th>
                <th scope="col">Address</th>
                <th scope="col">City</th>
                <th scope="col">State</th>
                <th scope="col">Pincode</th>
                <th scope="col">Country</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            {address?.length > 0 ? <tbody>
              {address.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <th scope="row">{index+1}</th>
                    <td>{item.label}</td>
                    <td>{item.address_line1}</td>
                    <td>{item.city}</td>
                    <td>{item.state}</td>
                    <td>{item.pincode}</td>
                    <td>{item.country}</td>
                    <td><button className="btn btn-danger" onClick={() => deleteAddressDataHandler(item.id)}><i className="fas fa-trash-alt"></i></button></td>
                  </tr>
                )
              })}
            </tbody>
              :
              <tbody>
                <tr>
                  <th scope="row" colSpan="8" className="text-center">No address is available. Please add an address</th>
                </tr>
              </tbody>
            }
          </table>
        </div>
      </section>

      
      <AddressModal modalCloseBtn={modalCloseBtn} label={label} labelError={labelError} labelErrorMsg={labelErrorMsg} labelHandler={labelHandler} addressInput={addressInput} addressInputError={addressInputError} addressInputErrorMsg={addressInputErrorMsg} addressInputHandler={addressInputHandler} city={city} cityError={cityError} cityErrorMsg={cityErrorMsg} cityHandler={cityHandler} state={state} stateError={stateError} stateErrorMsg={stateErrorMsg} stateHandler={stateHandler} pin={pin} pinError={pinError} pinErrorMsg={pinErrorMsg} pinHandler={pinHandler} addAddressHandler={addAddressHandler} />

    </Layout>
  )
}

export async function getServerSideProps(context) {

  const data = parseCookies(context.req)

    if(data?.userToken==undefined){
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
    }
    
  }

  return {
        props: {
            userToken: data && data,
        }, // will be passed to the page component as props
    }
}