import { useEffect, useState } from 'react';
import axios from '../../axios'
import constant from '../../constant'
import Loader from '../Loader'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux"
import { updateCartCounter, emptyCartAction, selectCart } from "../../redux/feature/cartSlice"
import { useCookies } from "react-cookie"
import Router from 'next/router'

export default function index({ cartSection, userToken }) {

    const closeCartHandler = () => {
        cartSection.current.style.display = 'none';
    }

    const dispatch = useDispatch();
    const cartRedux = useSelector(selectCart)

    const [cart, setCart] = useState([])
    const [showLoader, setShowLoader] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        loadCart()
    }, [cartRedux.updateCartCounter])

    const loadCart = () => {
        setShowLoader(true)
        axios.get('/get-cart', {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
            },
        })
        .then(res => {
            // console.log(res.data);
            setCart(res?.data?.data?.cart_items)
            setShowLoader(false)
            dispatch(updateCartCounter(res?.data?.data?.cart_items?.length))
            let subTotal = res?.data?.data?.cart_items.map(item => parseInt(item.price)*parseInt(item.quantity))
            setTotalPrice(subTotal?.reduce((prev, next) => prev + next))
        })
        .catch(err => {
            console.log('error'+err);
            setShowLoader(false)
            if(err?.response?.data?.message=='Token is Invalid' || err?.response?.data?.message=='Token is Expired' || err?.response?.data?.message=='Authorization Token not found'){
                removeCookie("userToken");
                Router.push('/')
              }
            dispatch(updateCartCounter(0))
        })
    }

    const deleteCart = (id) =>{
        setShowLoader(true)
        const formData = new FormData();
        formData.append('cart_id',id);
        axios.post('/delete-cart', formData ,{
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
              },
        })
        .then(res => {
            // console.log(res.data);
            setShowLoader(false)
            setCart([])
            toast.success('Item deleted from cart.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
              });
            loadCart()
        })
        .catch(err => {
            console.log(err);
            setShowLoader(false)
            if(err?.response?.data?.message=='Token is Invalid' || err?.response?.data?.message=='Token is Expired' || err?.response?.data?.message=='Authorization Token not found'){
                removeCookie("userToken");
                Router.push('/')
              }
            toast.error('Something went wrong. Please try again.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
              });
        })
    }

    const emptyCart = () => {
        setShowLoader(true)
        axios.get('/empty-cart', {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
              },
        })
        .then(res => {
            // console.log(res.data);
            setShowLoader(false)
            toast.success('Cart emptied successfully.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
              });
            dispatch(emptyCartAction())
            dispatch(updateCartCounter(0))
            setCart([])
            loadCart()
        })
        .catch(err => {
            console.log(err);
            setShowLoader(false)
            if(err?.response?.data?.message=='Token is Invalid' || err?.response?.data?.message=='Token is Expired' || err?.response?.data?.message=='Authorization Token not found'){
                removeCookie("userToken");
                Router.push('/')
              }
            toast.error('Something went wrong. Please try again.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
              });
        })
    }

    const placeOrderhandler = () => {
        setShowLoader(true)
        const formData = new FormData();
        axios.post('/place-order', formData ,{
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
              },
        })
        .then(res => {
            console.log(res.data);
            setShowLoader(false)
            setCart([])
            dispatch(updateCartCounter(0))
            toast.success('Order placed successfully.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
            });
            loadCart()
        })
        .catch(err => {
            console.log(err);
            setShowLoader(false)
            if(err?.response?.data?.message=='Token is Invalid' || err?.response?.data?.message=='Token is Expired' || err?.response?.data?.message=='Authorization Token not found'){
                removeCookie("userToken");
                Router.push('/')
              }
            toast.error('Something went wrong. Please try again.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
            });
        })
    }

    return <div>
        <div className="w3-ch-sideBar w3-bar-block w3-card-2 w3-animate-right" ref={cartSection} style={{ display: 'none', right: 0 }} id="Cart">
            {showLoader ? <Loader /> : null}
            {cart.length > 0 ? <div className="rightMenu-scroll">
                <div className="d-flex align-items-center justify-content-between slide-head py-3 px-3">
                    <h4 className="cart_heading fs-md ft-medium mb-0">Cart</h4>
                    <button onClick={closeCartHandler} className="close_slide"><i className="fas fa-times"></i></button>
                </div>
                <div className="right-ch-sideBar">

                    <div className="cart_select_items py-2">

                        {cart?.map((item) => {
                            return (
                                <div className="d-flex align-items-center justify-content-between br-bottom px-3 py-3" key={item.id}>
                                    <div className="cart_single d-flex align-items-center">
                                        <div className="cart_selected_single_thumb">
                                            <a href="#"><img src={`${constant.api_image_route}/${item.productImage}`} width="60" className="img-fluid" alt="" /></a>
                                        </div>
                                        <div className="cart_single_caption pl-2">
                                            <h4 className="product_title fs-sm ft-medium mb-0 lh-1">{item.productName}</h4>
                                            <p className="mb-2"><span className="text-dark ft-medium small">{item.size}</span>, <span className="text-dark small">{item.productGender}</span></p>
                                            <h4 className="fs-md ft-medium mb-0 lh-1">Rs.{item.price}</h4>
                                        </div>
                                    </div>
                                    <div className="fls_last"><button className="close_slide gray" onClick={()=>deleteCart(item.id)} ><i className="fas fa-trash-alt"></i></button></div>
                                </div>
                            )
                        })}




                    </div>

                    <div className="d-flex align-items-center justify-content-between br-top br-bottom px-3 py-3">
                        <h6 className="mb-0">Subtotal</h6>
                        <h3 className="mb-0 ft-medium">Rs. {totalPrice}</h3>
                    </div>

                    <div className="cart_action px-3 py-3">
                        <div className="form-group">
                            <button type="button" onClick={placeOrderhandler} className="btn d-block full-width btn-dark">Place Order</button>
                        </div>
                        <div className="form-group">
                            <button type="button" onClick={emptyCart} className="btn d-block full-width btn-dark-light">Empty Cart</button>
                        </div>
                    </div>

                </div>
            </div>:
            <div className="rightMenu-scroll">
                <div className="d-flex align-items-center justify-content-between slide-head py-3 px-3">
                    <h4 className="cart_heading fs-md ft-medium mb-0">Cart</h4>
                    <button onClick={closeCartHandler} className="close_slide"><i className="fas fa-times"></i></button>
                </div>
                <div className="d-flex align-items-center justify-center br-top br-bottom px-3 py-3">
                    <h4 className="product_title fs-sm ft-medium mb-0 lh-1">Cart is empty.</h4>
                </div>
            </div>
            }
        </div>
    </div>;
}
