import Head from 'next/head'
import Layout from '../../components/Layout'
import { useState, useEffect, useRef } from 'react'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/Breadcrumb'
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
import constant from '../../constant'
import useSWR from 'swr'
import axios from '../../axios';
import { parseCookies } from "../../helper/cookiedHelper"
import { useDispatch, useSelector } from "react-redux"
import { updateParameter, emptyParameter, selectParameter } from "../../redux/feature/parameterSlice"
import { useCookies } from "react-cookie"
import Router from 'next/router'
import KidModal from '../../components/KidModal'
import AddressModal from '../../components/AddressModal'

export default function Product({ userToken }) {

    const router = useRouter()
    const { id } = router.query

    const parameter = useSelector(selectParameter)

    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies(["userToken"])

    const cartSection = useRef(null);
    const modalCloseBtn= useRef(null);
    const modalCloseBtn2= useRef(null);

    const [showLoader, setShowLoader] = useState(true)
    const [product, setProduct] = useState({})

    const [size, setSize] = useState('')
    const [price, setPrice] = useState('')
    const [priceId, setPriceId] = useState('')
    const [schoolId, setSchoolId] = useState('')
    const [address, setAddress] = useState([])
    const [addressId, setAddressId] = useState('')
    const [kid, setKid] = useState([])
    const [kidDetails, setKidDetails] = useState({})
    const [kidId, setKidId] = useState('')
    const [paymentMode, setPaymentMode] = useState('')
    const [paymentModeData, setPaymentModeData] = useState([])
    const [deliveryType, setDeliveryType] = useState('')
    const [deliveryTypeData, setDeliveryTypeData] = useState([])

    const [quantity, setQuantity] = useState(1)

    const [parameters, setParameters] = useState([])

    const [school, setSchool] = useState([])
    const [clasSelect, setClasSelect] = useState([])

    const [name, setName] = useState('')
    const [nameError, setNameError] = useState(false)
    const [nameErrorMsg, setNameErrorMsg] = useState('')

    const [gender, setGender] = useState('Male')

    const [scholId, setScholId] = useState('')
    const [scholIdError, setScholIdError] = useState(false)
    const [scholIdErrorMsg, setScholIdErrorMsg] = useState('')

    const [section, setSection] = useState('')
    const [sectionError, setSectionError] = useState(false)
    const [sectionErrorMsg, setSectionErrorMsg] = useState('')

    const [clas, setClas] = useState('')
    const [clasError, setClasError] = useState(false)
    const [clasErrorMsg, setClasErrorMsg] = useState('')

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

    const { data, error } = useSWR(`${constant.api_route}/product/${id}`, fetcher)
    const { data:schoolData, error:schoolError } = useSWR(`${constant.api_route}/get-school`, fetcher)

    useEffect(() => {
        if (schoolError ) {
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
    }, [schoolError]);

    useEffect(() => {
        if (!schoolData) {
            setShowLoader(true)
        } else {
            setShowLoader(false)
            // console.log(data.data.schools)
            if(schoolData?.message=='Token is Invalid' || schoolData?.message=='Token is Expired' || schoolData?.message=='Authorization Token not found'){
                removeCookie("userToken");
                Router.push('/')
              }
            setSchool(schoolData?.data?.schools)
            if(schoolData?.data?.schools?.length > 0) {
                setScholId(schoolData?.data?.schools[0]?.school?.id)
                setClasSelect(schoolData?.data?.schools[0]?.classes)
                setClas(schoolData?.data?.schools[0]?.classes[0]?.id)
            }
        }

        return () => { };
    }, [schoolData]);

    const nameHandler = (text) =>{
        setName(text) 
        if (text == '') {
          setNameError(true) 
          setNameErrorMsg('Please enter a name') 
          return;
        } else if (!(/^[a-zA-Z\s]*$/.test(text))) {
          setNameError(true)
          setNameErrorMsg('please enter a valid name')  
          return;
        } else {
          setNameError(false)
          setNameErrorMsg('')  
        }
      }

      const sectionHandler = (text) =>{
        setSection(text) 
        if (text == '') {
          setSectionError(true) 
          setSectionErrorMsg('Please enter a section') 
          return;
        } else if (!(/^[0-9]*$/.test(text))) {
          setSectionError(true)
          setSectionErrorMsg('please enter a valid section')  
          return;
        } else {
          setSectionError(false)
          setSectionErrorMsg('')  
        }
      }

      const clasHandler = (text) =>{
        setClas(text)
        if (text == '') {
            setClasError(true) 
            setClasErrorMsg('Please select a class') 
            return;
        }
      }

      const genderHandler = (text) =>{
        setGender(text)
      }

      const scholIdHandler = (text) =>{
        setScholId(text)
        let mainIndex = school.findIndex((item,index)=> item?.school?.id==text)
        setClasSelect(school[mainIndex]?.classes)
        setClas(school[mainIndex]?.classes[0]?.id)
        if (text == '') {
            setScholIdError(true) 
            setScholIdErrorMsg('Please select a school') 
            return;
        }
      }

      const addKidHandler = async (e) =>{
        e.preventDefault()

        if (name == '') {
            setNameError(true) 
            setNameErrorMsg('Please enter a name') 
            return;
        }

        if (clas == '') {
            setClasError(true) 
            setClasErrorMsg('Please enter a class') 
            return;
        }

        if (section == '') {
            setSectionError(true) 
            setSectionErrorMsg('Please enter a section') 
            return;
        }

        if (scholId == '') {
            setScholIdError(true) 
            setScholIdErrorMsg('Please select a school') 
            return;
        }

        if(nameError){
            setNameError(true) 
            setNameErrorMsg('Please enter a name')
            return;
        }

        if(clasError){
            setClasError(true) 
            setClasErrorMsg('Please enter a class')
            return;
        }

        if(sectionError){
            setSectionError(true) 
            setSectionErrorMsg('Please enter a section')
            return;
        }

        if(scholIdError){
            setScholIdError(true) 
            setScholIdErrorMsg('Please select a school') 
            return;
        }

        const formData = new FormData();
        formData.append('school_id',scholId);
        formData.append('gender',gender);
        formData.append('name',name);
        formData.append('class_id',clas);
        formData.append('section_id',section);
        setShowLoader(true)

        axios.post('/add-kid',formData, {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
              },
        })
        .then(res => {
            setShowLoader(false)
            // console.log(res);
            getStudentDataHandler()
            toast.success('Added Successfully.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
              });
              setName('')
              setSection('')
              if(schoolData?.data?.schools.length > 0){
                  setSchoolId(schoolData?.data?.schools[0]?.id)
              }
              setGender('Male')
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
        setNameError(false)
        setNameErrorMsg('')
        setScholIdError(false)
        setScholIdErrorMsg('')

      }




    useEffect(() => {
        if (error) {
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
    }, [error]);

    useEffect(() => {
        if (!data) {
            setShowLoader(true)
        } else {
            setShowLoader(false)
            if (data?.message == 'Token is Invalid' || data?.message == 'Token is Expired' || data?.message == 'Authorization Token not found') {
                removeCookie("userToken");
                Router.push('/')
            }
            setProduct(data?.data)
            if (data?.data?.sizes?.length > 0) {
                setSize(data?.data?.sizes[0]?.id)
                let amount = data?.data?.default_prices?.filter(item => item?.size_id == data?.data?.sizes[0]?.id)
                if (amount.length > 0) {
                    setPrice(amount[0].price)
                    setPriceId(amount[0].id)
                }
            }
            // console.log(data?.data);
        }

        return () => { };
    }, [data]);

    useEffect(() => {

        getAddress()
        getStudentDataHandler()
        getPaymentMode()
        getDeliveryType()


        return () => { };
    }, []);

    const getStudentDataHandler = async () => {
        setShowLoader(true)

        axios.get('/get-kid', {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
            },
        })
            .then(res => {
                // console.log(res?.data?.data?.kids[0]?.school_id);
                setKid(res?.data?.data?.kids)
                if (res?.data?.data?.kids?.length > 0) {
                    setKidId(res?.data?.data?.kids[0]?.id)
                    setKidDetails({...res?.data?.data?.kids[0]})
                    setSchoolId(res?.data?.data?.kids[0]?.school_id)
                }
            })
            .catch(err => {
                console.log(err);
                if (err?.response?.data?.message == 'Token is Invalid' || err?.response?.data?.message == 'Token is Expired' || err?.response?.data?.message == 'Authorization Token not found') {
                    removeCookie("userToken");
                    Router.push('/')
                }

            })

            setShowLoader(false)
    }

    const getAddress = async () => {
        setShowLoader(true)
        
        axios.get('/get-address', {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
            },
        })
            .then(res => {
                // console.log(res.data);
                setAddress(res?.data?.data?.address)
                if (res?.data?.data?.address?.length > 0) {
                    setAddressId(res?.data?.data?.address[0].id)
                }
            })
            .catch(err => {
                console.log(err);
                if (err?.response?.data?.message == 'Token is Invalid' || err?.response?.data?.message == 'Token is Expired' || err?.response?.data?.message == 'Authorization Token not found') {
                    removeCookie("userToken");
                    Router.push('/')
                }

            })

        

        setShowLoader(false)
    }


    const getPaymentMode = async () => {
        setShowLoader(true)

        axios.get('/get-payment-modes', {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
            },
        })
            .then(res => {
                // console.log(res?.data?.data?.kids[0]?.school_id);
                setPaymentModeData(res?.data?.data?.paymentModes)
                if (res?.data?.data?.paymentModes?.length > 0) {
                    setPaymentMode(res?.data?.data?.paymentModes[0]?.id)
                }
            })
            .catch(err => {
                console.log(err);
                if (err?.response?.data?.message == 'Token is Invalid' || err?.response?.data?.message == 'Token is Expired' || err?.response?.data?.message == 'Authorization Token not found') {
                    removeCookie("userToken");
                    Router.push('/')
                }

            })

        setShowLoader(false)
    }

    const getDeliveryType = async () => {
        setShowLoader(true)

        axios.get('/get-delivery-types', {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
            },
        })
            .then(res => {
                // console.log(res?.data?.data?.kids[0]?.school_id);
                setDeliveryTypeData(res?.data?.data?.deiveryTypes)
                if (res?.data?.data?.deiveryTypes?.length > 0) {
                    setDeliveryType(res?.data?.data?.deiveryTypes[0]?.id)
                }
            })
            .catch(err => {
                console.log(err);
                if (err?.response?.data?.message == 'Token is Invalid' || err?.response?.data?.message == 'Token is Expired' || err?.response?.data?.message == 'Authorization Token not found') {
                    removeCookie("userToken");
                    Router.push('/')
                }

            })

        setShowLoader(false)
    }


    const setSizeAndPrice = (s) => {
        setSize(s)
        let amount = product?.default_prices?.filter(item => item?.size_id == s)
        if (amount?.length > 0) {
            setPrice(amount[0].price)
            setPriceId(amount[0].id)
        }
    }

    const parameterHandler = () => {

    if(priceId== '' || schoolId=='' || addressId=='' || kidId=='' || paymentMode == '' || deliveryType==''){
        toast.error('Something went wrong. Please refresh the page.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            toastId: new Date()
        });
        return;
    }
        
        let parameterData = {
            product,
            size,
            price,
            priceId,
            paymentMode,
            deliveryType,
            kidId,
            schoolId,
            kidDetails,
            quantity,
            productId:id,
            addressId
        }
        dispatch(updateParameter(parameterData))
        if(parameter.parameter!=null){
            router.push(`/parameter`)
        }
    }

    const kidHandler = (value) => {
        setKidId(value)
        const kidDetail = kid.filter(item => item.id == value)
        if(kidDetail?.length > 0) {
            setSchoolId(kidDetail[0]?.school_id)
            setKidDetails({...kidDetail})
        }
    }

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
            getAddress()
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
            modalCloseBtn2.current.click();
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



    return (
        <Layout cartSection={cartSection} userToken={userToken}>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {showLoader ? <Loader /> : null}
            <Breadcrumb link="Products" />

            <section className="middle" id="prduct">
                <div className="container">
                    <div className="row">

                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            <div className="sp-loading"><img src={`${constant.api_image_route}/${product?.product?.image}`} style={{ width: '100%' }} alt="" /></div>
                        </div>

                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            <div className="prd_details">

                                <div className="prt_01 mb-2"><span className="text-success bg-light-success rounded px-2 py-1">{product?.product?.gender}</span></div>
                                <div className="prt_02 mb-3">
                                    <h2 className="ft-bold mb-1">{product?.product?.name}</h2>
                                    <div className="text-left">
                                        <div className="star-rating align-items-center d-flex justify-content-left mb-1 p-0">
                                            <i className="fas fa-star filled"></i>
                                            <i className="fas fa-star filled"></i>
                                            <i className="fas fa-star filled"></i>
                                            <i className="fas fa-star filled"></i>
                                            <i className="fas fa-star"></i>
                                        </div>
                                        <div className="elis_rty"><span className="ft-bold theme-cl fs-lg mr-2">Rs. {price}</span></div>
                                    </div>
                                </div>

                                <div className="prt_03 mb-4">
                                    <p>{product?.product?.description}</p>
                                </div>


                                <div className="prt_04 mb-4">
                                    <div className="text-left pb-0 pt-2">
                                        <div className="col-12 col-lg-8" style={{ paddingLeft: 0 }}>
                                            <p>Select Child:</p>
                                            <div className="d-flex align-items-center justify-content-between" style={{ width: '100%' }}>

                                               {kid?.length>0 ? <select className="mb-2 custom-select" value={kidId} onChange={(e) => kidHandler(e.target.value)}>
                                                    {kid.map((item, index) => {
                                                        return <option value={item?.id} key={index} disabled={item.gender != product?.product?.gender ? true : false}>{item?.name}</option>
                                                    })}

                                                </select> : null}
                                                <a href="#" data-toggle="modal" data-target="#login1" className="btn custom-height bg-dark mb-2 ml-2">
                                                    <i className="fas fa-user mr-2"></i>Add Kid
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="prt_04 mb-4">
                                    <div className="text-left pb-0 pt-2">
                                        <div className="col-12 col-lg-10" style={{ paddingLeft: 0 }}>
                                            <p>Select Address:</p>
                                            <div className="d-flex align-items-center justify-content-between" style={{ width: '100%' }}>

                                                {address?.length > 0 ? <select className="mb-2 custom-select" value={addressId} onChange={(e) => setAddressId(e.target.value)}>
                                                    {address.map((item, index) => {
                                                        return <option value={item?.id} key={index}>{item?.label} ({item?.address_line1?.substring(0, 30)}...)</option>
                                                    })}

                                                </select> : null}
                                                <a href="#" data-toggle="modal" data-target="#address1" className="btn custom-height bg-dark mb-2 ml-2">
                                                    <i className="fas fa-map-marked-alt mr-2"></i>Add Address
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="prt_04 mb-4">
                                    <div className="text-left pb-0 pt-2">
                                        <div className="col-12 col-lg-7" style={{ paddingLeft: 0 }}>
                                            <p>Select Delivery Type:</p>
                                            <div className="d-flex align-items-center justify-content-between" style={{ width: '100%' }}>


                                                <select className="mb-2 custom-select" value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)} >
                                                    {deliveryTypeData.map((item, index) => {
                                                        return <option value={item?.id} key={index} >{item?.name}</option>
                                                    })}
                                                </select>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="prt_04 mb-4">
                                    <div className="text-left pb-0 pt-2">
                                        <div className="col-12 col-lg-7" style={{ paddingLeft: 0 }}>
                                            <p>Select Payment Mode:</p>
                                            <div className="d-flex align-items-center justify-content-between" style={{ width: '100%' }}>


                                                <select className="mb-2 custom-select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} >
                                                    {paymentModeData.map((item, index) => {
                                                        return <option value={item?.id} key={index} >{item?.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="prt_04 mb-4">
                                    <div className="text-left pb-0 pt-2">
                                        <div className="col-12 col-lg-7" style={{ paddingLeft: 0 }}>
                                            <p>Select Quantity:</p>
                                            <div className="d-flex align-items-center justify-content-between" style={{ width: '100%' }}>


                                                <select className="mb-2 custom-select" value={quantity} onChange={(e) => setQuantity(e.target.value)} >
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="prt_04 mb-4">
                                    <p className="d-flex align-items-center mb-0 text-dark ft-medium">Select Size:</p>
                                    <div className="text-left pb-0 pt-2">

                                        {product?.sizes?.map((item, index) => {
                                            return (
                                                <div className="form-check size-option form-option form-check-inline mb-2" key={index}>
                                                    <input className="form-check-input" type="radio" name="size" id={item.id} value={item.id} onChange={(e) => setSizeAndPrice(e.target.value)} checked={item.id == size ? true : false} />
                                                    <label className="form-option-label" htmlFor={item.id}>{item.name}</label>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>

                                <div className="prt_05 mb-4">
                                    <div className="form-row mb-7">
                                        <div className="col-12 col-lg">
                                            <button onClick={parameterHandler} className="btn btn-block custom-height bg-dark mb-2 text-white" >
                                                <i className="lni lni-shopping-basket mr-2"></i>Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>


                    </div>
                </div>
            </section>

            <KidModal modalCloseBtn={modalCloseBtn} name={name} nameError={nameError} nameErrorMsg={nameErrorMsg} nameHandler={nameHandler} gender={gender} genderHandler={genderHandler} schoolId={scholId} school={school} schoolIdError={scholIdError} schoolIdHandler={scholIdHandler} clasErrorMsg={clasErrorMsg} clas={clas} clasSelect={clasSelect} clasHandler={clasHandler} clasError={clasError} clasErrorMsg={clasErrorMsg} section={section} sectionError={sectionError} sectionErrorMsg={sectionErrorMsg} sectionHandler={sectionHandler} addKidHandler={addKidHandler} />

            <AddressModal modalCloseBtn={modalCloseBtn2} label={label} labelError={labelError} labelErrorMsg={labelErrorMsg} labelHandler={labelHandler} addressInput={addressInput} addressInputError={addressInputError} addressInputErrorMsg={addressInputErrorMsg} addressInputHandler={addressInputHandler} city={city} cityError={cityError} cityErrorMsg={cityErrorMsg} cityHandler={cityHandler} state={state} stateError={stateError} stateErrorMsg={stateErrorMsg} stateHandler={stateHandler} pin={pin} pinError={pinError} pinErrorMsg={pinErrorMsg} pinHandler={pinHandler} addAddressHandler={addAddressHandler} />

        </Layout>
    )
}

// export async function getServerSideProps(context) {
//     let product = {}
//     try {
//         const res = await fetch(`http://35.154.209.18/api/product/${context.params.id}`, {
//             headers: {
//                 'authorization': 'bearer ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8zNS4xNTQuMjA5LjE4XC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNjQzMzkwMjkxLCJleHAiOjE2NDQwNzY2OTEsIm5iZiI6MTY0MzM5MDI5MSwianRpIjoiUm9VUWpNaFVubWVSdnl1MyIsInN1YiI6NywicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.qzskxa9GVdwCgLuzaOKHHhGh-vO83hyZwhwbKZ21fxk",
//             },
//         });
//         product = await res.json();
//     } catch (error) {
//         console.log(error.response)
//     }

//     return {
//         props: {
//             product: product.data
//         }, // will be passed to the page component as props
//     }
// }


export async function getServerSideProps(context) {

    const data = parseCookies(context.req)

    if (data?.userToken == undefined) {
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
