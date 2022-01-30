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
import OrderItem from '../../components/Order'
import { parseCookies } from "../../helper/cookiedHelper"


export default function Order({userToken}) {

    const router = useRouter()
    const { id } = router.query

    const cartSection = useRef(null);
    const modalCloseBtn = useRef(null);

    const [showLoader, setShowLoader] = useState(true)
    const [order, setOrder] = useState([])


    const fetcher = (...args) => fetch(...args, {
        headers: {
            'authorization': 'bearer ' + JSON.parse(userToken.userToken),
        },
    }).then((res) => res.json())

    const { data, error } = useSWR(`${constant.api_route}/order/${id}`, fetcher)

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
            setOrder(data?.data?.sub_orders)
            // console.log(data);
        }

        return () => { };
    }, [data]);

    return (
        <Layout cartSection={cartSection} userToken={userToken}>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {showLoader ? <Loader /> : null}
            <Breadcrumb link={`Orders / ${id}`} />
            <section className="middle" id="prduct">
                <div className="container">

                    <div className="">
                        <div className="rightMenu-scroll">
                            <div className="d-flex align-items-center justify-content-between slide-head py-3 px-3">
                                <h4 className="cart_heading fs-md ft-medium mb-0">Order Item List </h4>
                            </div>
                            <div className="right-ch-sideBar">

                                <div className="cart_select_items py-2">

                                    {order?.map((item)=>{
                                        return <OrderItem key={item.id} item={item} />
                                    })}

                                </div>

                                <div className="d-flex align-items-center justify-content-between br-top br-bottom px-3 py-3">
                                    <h6 className="mb-0">Subtotal</h6>
                                    <h3 className="mb-0 ft-medium">Rs. {order?.length>0 ? order[0]?.sub_total : 0}</h3>
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