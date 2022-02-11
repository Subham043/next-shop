import Head from 'next/head'
import Layout from '../../components/Layout'
import { useState, useEffect, useRef } from 'react'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/Breadcrumb'
import Modal from '../../components/Modal'
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
import constant from '../../constant'
import useSWR from 'swr'
import axios from '../../axios';
import { parseCookies } from "../../helper/cookiedHelper"
import { useDispatch } from "react-redux"
import { updateCart } from "../../redux/feature/cartSlice"
import { useCookies } from "react-cookie"
import Router from 'next/router'

export default function Parameter({ userToken }) {

    const router = useRouter()
    const { id } = router.query

    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies(["userToken"])

    const cartSection = useRef(null);
    const modalCloseBtn = useRef(null);

    const [showLoader, setShowLoader] = useState(true)
    const [product, setProduct] = useState({})

    const [size, setSize] = useState('')
    const [price, setPrice] = useState('')
    const [priceId, setPriceId] = useState('')
    const [school, setSchool] = useState([])
    const [schoolId, setSchoolId] = useState('')
    const [address, setAddress] = useState([])
    const [addressId, setAddressId] = useState('')
    const [kid, setKid] = useState([])
    const [kidId, setKidId] = useState('')
    const [paymentMode, setPaymentMode] = useState(1)

    const [quantity, setQuantity] = useState('')
    const [quantityError, setQuantityError] = useState(false)
    const [quantityErrorMsg, setQuantityErrorMsg] = useState('')

    const [parameters, setParameters] = useState([])

    const fetcher = (...args) => fetch(...args, {
        headers: {
            'authorization': 'bearer ' + JSON.parse(userToken.userToken),
        },
    }).then((res) => res.json())

    const { data, error } = useSWR(`${constant.api_route}/product/${id}`, fetcher)




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

        getSchoolAndAddress()


        return () => { };
    }, []);

    const getSchoolAndAddress = async () => {
        setShowLoader(true)
        axios.get('/get-school', {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
            },
        })
            .then(res => {
                // console.log(res.data);
                setSchool(res?.data?.data?.schools)
                if (res?.data?.data?.schools?.length > 0) {
                    setSchoolId(res?.data?.data?.schools[0].id)
                }
            })
            .catch(err => {
                console.log(err);
                if (err?.response?.data?.message == 'Token is Invalid' || err?.response?.data?.message == 'Token is Expired' || err?.response?.data?.message == 'Authorization Token not found') {
                    removeCookie("userToken");
                    Router.push('/')
                }
                // toast.error(err?.response?.data?.data, {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     toastId: new Date()
                //   });

            })

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
                // toast.error(err?.response?.data?.data, {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     toastId: new Date()
                //   });

            })

        axios.get('/get-kid', {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
            },
        })
            .then(res => {
                // console.log(res.data);
                setKid(res?.data?.data?.kids)
                if (res?.data?.data?.kids?.length > 0) {
                    setKidId(res?.data?.data?.kids[0].id)
                }
            })
            .catch(err => {
                console.log(err);
                if (err?.response?.data?.message == 'Token is Invalid' || err?.response?.data?.message == 'Token is Expired' || err?.response?.data?.message == 'Authorization Token not found') {
                    removeCookie("userToken");
                    Router.push('/')
                }
                // toast.error(err?.response?.data?.data, {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     toastId: new Date()
                //   });

            })

        setShowLoader(false)
    }

    const quantityHandler = (text) => {
        setQuantity(text)
        if (text == '') {
            setQuantityError(true)
            setQuantityErrorMsg('Please enter a quantity')
            return;
        } else if (!(/^[0-9\s]*$/.test(text))) {
            setQuantityError(true)
            setQuantityErrorMsg('please enter a valid quantity')
            return;
        } else {
            setQuantityError(false)
            setQuantityErrorMsg('')
        }
    }


    const addToCartHandler = (e) => {
        e.preventDefault();
        if (quantity == '') {
            setQuantityError(true)
            setQuantityErrorMsg('Please enter a quantity')
            toast.error('Please fill all the required fields', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
            });
            return;
        }
        if (quantityError) {
            setQuantityError(true)
            setQuantityErrorMsg('Please enter a quantity')
            toast.error('Please fill all the required fields', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
            });
            return;
        }
        if (kidId == '') {
            toast.error('Please select a kid or add a new kid', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
            });
            return;
        }
        if (schoolId == '') {
            toast.error('Please select a school', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
            });
            return;
        }
        if (addressId == '') {
            toast.error('Please select an address or add a new address', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
            });
            return;
        }
        if (parameters.length != product?.parameters?.length) {
            toast.error('Please fill all the required fields', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
            });
            return;
        }

        const formData = new FormData();
        formData.append('product_id', product?.product?.id);
        formData.append('quantity', quantity);
        formData.append('price_id', priceId);
        formData.append('school_id', schoolId);
        formData.append('payment_mode_id', paymentMode);
        formData.append('address_id', addressId);
        formData.append('kid_id', kidId);
        formData.append('parameters', JSON.stringify(parameters));
        setShowLoader(true)

        axios.post('/add-to-cart', formData, {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
            },
        })
            .then(res => {
                setShowLoader(false)
                // console.log(res);
                // getAddressDataHandler()
                toast.success('Added to cart.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    toastId: new Date()
                });
                setQuantity('')
                modalCloseBtn.current.click();
                dispatch(updateCart());
            })
            .catch(err => {
                setShowLoader(false)
                console.log(err);
                if (err?.response?.data?.message == 'Token is Invalid' || err?.response?.data?.message == 'Token is Expired' || err?.response?.data?.message == 'Authorization Token not found') {
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
        setQuantityError(false)
        setQuantityErrorMsg('')

    }

    const setSizeAndPrice = (s) => {
        setSize(s)
        let amount = product?.default_prices?.filter(item => item?.size_id == s)
        if (amount?.length > 0) {
            setPrice(amount[0].price)
            setPriceId(amount[0].id)
        }
    }

    const parametersHandler = (value, key, i) => {
        if (typeof parameters[i] === 'undefined') {
            setParameters([...parameters, { parameterName: key, parameterValue: value }])
        } else {
            let newParameters = parameters.filter((item, index) => {
                return i != index;
            })
            setParameters([...newParameters, { parameterName: key, parameterValue: value }])
        }
    }




    const youtube_parser = (url = '') => {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
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
                            <div className="row align-items-center justify-content-center">
                                <div className="col-xl-11 col-lg-12 col-md-12 col-sm-12">
                                    <ul className="nav nav-tabs b-0 d-flex align-items-center justify-content-center simple_tab_links mb-4" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link active" id="description-tab" href="#description" data-toggle="tab" role="tab" aria-controls="description" aria-selected="true">Size Image Guide</a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link" href="#information" id="information-tab" data-toggle="tab" role="tab" aria-controls="information" aria-selected="false">Size Video Guide</a>
                                        </li>
                                    </ul>

                                    <div className="tab-content" id="myTabContent">

                                        <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
                                            <div className="description_info">
                                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                    <div className="sp-loading"><img src={`${constant.api_image_route}/${product?.product?.size_guide_image}`} style={{ width: '100%' }} alt="" /></div>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade" id="information" role="tabpanel" aria-labelledby="information-tab">
                                            <div className="description_info">
                                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                    <div className="sp-loading">
                                                        <iframe loading="lazy" src={`https://www.youtube.com/embed/${youtube_parser(product?.product?.video_link)}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen="" style={{ width: '100%', height: '450px' }} frameBorder="0"></iframe>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
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
                                        <div className="col-12 col-lg-7" style={{ paddingLeft: 0 }}>
                                            <p>Select Child:</p>
                                            <div className="d-flex align-items-center justify-content-between" style={{ width: '100%' }}>

                                                <select className="mb-2 custom-select" value={kidId} onChange={(e) => setKidId(e.target.value)}>
                                                    {kid.map((item, index) => {
                                                        return <option value={item?.id} key={index} disabled={item.gender != product?.product?.gender ? true : false}>{item?.name}</option>
                                                    })}

                                                </select>
                                                <a href="#" data-toggle="modal" data-target="#login1" className="btn custom-height bg-dark mb-2 ml-2">
                                                    <i className="fas fa-user mr-2"></i>Add Kid
                                                </a>
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
                                            <a data-toggle="modal" data-target="#login1" className="btn btn-block custom-height bg-dark mb-2 text-white">
                                                <i className="lni lni-shopping-basket mr-2"></i>Add to Cart
                                            </a>
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>


                    </div>
                </div>
            </section>
            
            <Modal modalId="login1" refValue={modalCloseBtn}>
                <div className="text-center mb-4">
                    <h2 className="m-0 ft-regular">Add {product?.product?.name} to cart</h2>
                </div>
                <form>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input type="text" className="form-control" placeholder="Quantity*" value={quantity} onChange={(e) => quantityHandler(e.target.value)} />
                        {quantityError ? <i style={{ color: 'red' }}>{quantityErrorMsg}</i> : null}
                    </div>
                    {product?.parameters?.map((item, index) => {
                        return (
                            <div className="form-group" key={index}>
                                <label>{item.name}</label>
                                <input type="text" className="form-control" placeholder={`${item.name}*`} value={parameters[index]?.parameterValue || ''} onChange={(e) => parametersHandler(e.target.value, item.name, index)} />
                                {/* {quantityError ? <i style={{ color: 'red' }}>{quantityErrorMsg}</i>:null} */}
                            </div>
                        )
                    })}
                    <div className="form-group">
                        <label>Kid</label>
                        <select className="mb-2 custom-select" value={kidId} onChange={(e) => setKidId(e.target.value)}>
                            {kid.map((item, index) => {
                                return <option value={item?.id} key={index}>{item?.name}</option>
                            })}

                        </select>
                    </div>
                    <div className="form-group">
                        <label>School</label>
                        <select className="mb-2 custom-select" value={schoolId} onChange={(e) => setSchoolId(e.target.value)}>
                            {school.map((item, index) => {
                                return <option value={item?.id} key={index}>{item?.name}</option>
                            })}

                        </select>
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <select className="mb-2 custom-select" value={addressId} onChange={(e) => setAddressId(e.target.value)}>
                            {address.map((item, index) => {
                                return <option value={item?.id} key={index}>{item?.label} ({item?.address_line1?.substring(0, 30)}...)</option>
                            })}

                        </select>
                    </div>
                    <div className="form-group">
                        <label>Payment Mode</label>
                        <select className="mb-2 custom-select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} >
                            <option value="1">Pay on Delivery</option>
                            <option value="2">Pay at school</option>
                            <option value="3">Pay online</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <button onClick={(e) => addToCartHandler(e)} className="btn btn-md full-width bg-dark text-light fs-md ft-medium">Add To Cart</button>
                    </div>

                </form>
            </Modal>

        </Layout>
    )
}


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
