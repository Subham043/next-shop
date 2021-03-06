import Head from 'next/head'
import Layout from '../../components/Layout'
import { useState, useEffect, useRef } from 'react'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/Breadcrumb'
import { toast } from 'react-toastify';
import Link from 'next/link'
import useSWR from 'swr'
import constant from '../../constant'
import { parseCookies } from "../../helper/cookiedHelper"
import { useCookies } from "react-cookie"
import Router from 'next/router'

export default function Orders({userToken}) {

    const [showLoader, setShowLoader] = useState(true)
    const [order, setOrder] = useState([])

    const [cookies, setCookie, removeCookie] = useCookies(["userToken"])

    const cartSection= useRef(null);


    const fetcher = (...args) => fetch(...args, {
        headers: {
            'authorization': 'bearer ' + JSON.parse(userToken.userToken),
        },
    }).then((res) => res.json())

    const { data:orderData, error:orderError } = useSWR(`${constant.api_route}/get-order`, fetcher)




    useEffect(() => {
        if (orderError) {
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
    }, [orderError]);

    useEffect(() => {
        if (!orderData) {
            setShowLoader(true)
        } else {
            setShowLoader(false)
            // console.log(orderData)
            if(orderData?.message=='Token is Invalid' || orderData?.message=='Token is Expired' || orderData?.message=='Authorization Token not found'){
                removeCookie("userToken");
                Router.push('/')
              }
            setOrder(orderData?.data?.orders)
        }

        return () => { };
    }, [orderData]);

    const date = (date) => {
        const d = new Date(date);

        return `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}, ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }

    





    return (
        <Layout cartSection={cartSection} userToken={userToken}>
            <Head>
                <title>Cotton Culture</title>
            </Head>
            {showLoader ? <Loader /> : null}
            <Breadcrumb link="Orders" />

            <section className="middle" id="prduct">
                <div className="container">

                    <div className="form-group">
                        <div className="d-flex align-items-center justify-content-between">
                            <h2 className="ft-bold mb-1">Orders</h2>
                        </div>
                        <hr />
                    </div>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr className="table-dark">
                                <th scope="col">#</th>
                                <th scope="col">Order ID</th>
                                <th scope="col">Placed At</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        {order?.length > 0 ? <tbody>
                            {order.map((item, index)=>{
                                return (
                                <tr key={item.id}>
                                    <th scope="row">{index+1}</th>
                                    <td>{item.cc_order_id}</td>
                                    <td>{date(item.created_at)}</td>
                                    <td><Link href={`/orders/${item.id}`}><a className="btn btn-success"><i className="far fa-eye"></i></a></Link></td>
                                </tr>
                                )
                            })}
                        </tbody>
                        :
                        <tbody>
                          <tr>
                            <th scope="row" colSpan="8" className="text-center">No order is available. Please place an order</th>
                          </tr>
                        </tbody>
                      }
                    </table>
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
