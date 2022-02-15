import Head from 'next/head'
import Layout from '../../components/Layout'
import { useState, useEffect, useRef } from 'react'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/Breadcrumb'
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
import constant from '../../constant'
import axios from '../../axios';
import { parseCookies } from "../../helper/cookiedHelper"
import { useDispatch, useSelector } from "react-redux"
import { updateCart } from "../../redux/feature/cartSlice"
import { updateParameter, emptyParameter, selectParameter } from "../../redux/feature/parameterSlice"
import { useCookies } from "react-cookie"
import Router from 'next/router'

export default function Parameter({ userToken }) {

    const router = useRouter()


    const parameter = useSelector(selectParameter)

    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies(["userToken"])

    const cartSection = useRef(null);

    const [showLoader, setShowLoader] = useState(false)


    const [parameters, setParameters] = useState([])

    useEffect(() => {
        setShowLoader(true)
        
        if(parameter.parameter==null){
            router.push(`/products`)
            return;
        }
        let paramValues = parameter?.parameter?.product?.default_prices?.filter((item)=>item.size_id==parameter?.parameter?.size)
        if(paramValues?.length>0){
            setParameters(paramValues[0]?.parameters?.split(','))
        }
        setShowLoader(false)
    }, [parameter.parameter])

    


    const addToCartHandler = async (e) => {
        e.preventDefault();

        let err = 0;

        parameters.map(item => {
            if(item==''){
                err++
            }
        })

        if(err>0){
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
        formData.append('product_id', parameter?.parameter?.productId);
        formData.append('quantity', parameter?.parameter?.quantity);
        formData.append('price_id', parameter?.parameter?.priceId);
        formData.append('school_id', parameter?.parameter?.schoolId);
        formData.append('payment_mode_id', parameter?.parameter?.paymentMode);
        formData.append('address_id', parameter?.parameter?.addressId);
        formData.append('kid_id', parameter?.parameter?.kidId);
        formData.append('class_id', parameter?.parameter?.kidDetails?.class_id);
        formData.append('section_id', parameter?.parameter?.kidDetails?.section_id);
        formData.append('delivery_type_id', parameter?.parameter?.deliveryType);
        formData.append('parameters', JSON.stringify(parameters));
        // console.log(parameters);return;
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
                dispatch(updateCart());
                dispatch(emptyParameter());
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

    }

    const parametersHandler = (value, i) => {
        let items = parameters;
        items[i] = value;
        setParameters([...items]);
    }



    const youtube_parser = (url = '') => {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }

    return (
        <Layout cartSection={cartSection} userToken={userToken}>
            <Head>
                <title>Cotton Culture</title>
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
                                                    <div className="sp-loading"><img src={`${constant.api_image_route}/${parameter?.parameter?.product?.product?.size_guide_image}`} style={{ width: '100%' }} alt="" /></div>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade" id="information" role="tabpanel" aria-labelledby="information-tab">
                                            <div className="description_info">
                                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                    <div className="sp-loading">
                                                        <iframe loading="lazy" src={`https://www.youtube.com/embed/${youtube_parser(parameter?.parameter?.product?.product?.video_link)}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen="" style={{ width: '100%', height: '450px' }} frameBorder="0"></iframe>
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

                                <div className="prt_01 mb-2"><span className="text-success bg-light-success rounded px-2 py-1">{parameter?.parameter?.product?.product?.gender}</span></div>
                                <div className="prt_02 mb-3">
                                    <h2 className="ft-bold mb-1">{parameter?.parameter?.product?.product?.name}</h2>
                                    <div className="text-left">
                                        <div className="star-rating align-items-center d-flex justify-content-left mb-1 p-0">
                                            <i className="fas fa-star filled"></i>
                                            <i className="fas fa-star filled"></i>
                                            <i className="fas fa-star filled"></i>
                                            <i className="fas fa-star filled"></i>
                                            <i className="fas fa-star"></i>
                                        </div>
                                        <div className="elis_rty"><span className="ft-bold theme-cl fs-lg mr-2">Rs. {parameter?.parameter?.price}</span></div>
                                    </div>
                                </div>

                                <div className="prt_03 mb-4">
                                    <p>{parameter?.parameter?.product?.product?.description}</p>
                                </div>

                                <div className="prt_04 mb-4">
                                    <p className=" mb-0 text-dark">Child: <span className="ft-medium"> {parameter?.parameter?.kidDetails?.name}</span></p>
                                
                                </div>

                                <div className="prt_04 mb-4">
                                    <p className="d-flex align-items-center mb-0 text-dark ft-medium">Enter Measurement Parameters</p>
                                    <div className="text-left pb-0 pt-2">

                                        {parameter?.parameter?.product?.parameters?.map((item, index) => {
                                            return (
                                                <div className="form-group" key={index}>
                                                    <label>{item.name}</label>
                                                    <input type="text" className="form-control" placeholder={`${item.name}*`} value={parameters[index] || ''} onChange={(e) => parametersHandler(e.target.value, index)} />
                                                    {/* {quantityError ? <i style={{ color: 'red' }}>{quantityErrorMsg}</i>:null} */}
                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>

                                <div className="prt_05 mb-4">
                                    <div className="form-row mb-7">
                                        <div className="col-12 col-lg">
                                            <button onClick={addToCartHandler} className="btn btn-block custom-height bg-dark mb-2 text-white">
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
