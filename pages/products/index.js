import Head from 'next/head'
import Slider from '../../components/Slider'
import Layout from '../../components/Layout'
import { useState, useEffect, useRef } from 'react'
import Loader from '../../components/Loader'
import Product from '../../components/Product'
import { toast } from 'react-toastify';
import axios from '../../axios'
import { parseCookies } from "../../helper/cookiedHelper"

export default function Products({userToken}) {

  const [products, setProducts] = useState([]);
  const cartSection= useRef(null);

  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    setShowLoader(true)
    axios.get('/get-product',{
      headers: {
        'authorization': 'bearer ' + JSON.parse(userToken.userToken),
      },
    })
    .then(res => {
      setShowLoader(false)
      // console.log(res.data.data);
      setProducts(res.data.data.products)
    })
    .catch(err => {
      setShowLoader(false)
      // console.log(err.response)
      toast.error('Something went wrong. Please refresh the page', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        toastId: new Date()
      });
      
    })
  
    return () => {};

  }, []);
  

  return (
    <Layout cartSection={cartSection} userToken={userToken}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {showLoader?<Loader />:null} 
      <Slider />

      <section className="space min pt-0 custom-padding-top">
				<div className="container">
					
					<div className="row">
						<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
							
							<ul className="nav nav-tabs b-0 d-flex align-items-center justify-content-center simple_tab_links mb-4" id="myTab" role="tablist">
								<li className="nav-item" role="presentation">
									<a className="nav-link" id="all-tab" href="#all" data-toggle="tab" role="tab" aria-controls="all" aria-selected="true">All</a>
								</li>
								<li className="nav-item" role="presentation">
									<a className="nav-link active" href="#male" id="male-tab" data-toggle="tab" role="tab" aria-controls="mens" aria-selected="false">Male's</a>
								</li>
								<li className="nav-item" role="presentation">
									<a className="nav-link" href="#female" id="female-tab" data-toggle="tab" role="tab" aria-controls="women" aria-selected="false">Female's</a>
								</li>
							</ul>
							
							<div className="tab-content" id="myTabContent">
								
								<div className="tab-pane fade" id="all" role="tabpanel" aria-labelledby="all-tab">
									<div className="tab_product">
										<div className="row rows-products">
											{products.map((item) => {
                        return <Product item={item} key={item.id} />
                      })}
											
										</div>
									</div>
								</div>
								
								<div className="tab-pane fade show active" id="male" role="tabpanel" aria-labelledby="male-tab">
									<div className="tab_product">
										<div className="row rows-products">
											
                    {products.map((item) => {
                      if(item.gender === 'male' || item.gender === 'Male' || item.gender === 'MALE'){
                        return <Product item={item} key={item.id} />
                      }
                    })}
											
										</div>
									</div>
								</div>
								
								<div className="tab-pane fade" id="female" role="tabpanel" aria-labelledby="female-tab">
									<div className="tab_product">
										<div className="row rows-products">
                    {products.map((item) => {
                      if(item.gender === 'female' || item.gender === 'Female' || item.gender === 'FEMALE'){
                        return <Product item={item} key={item.id} />
                      }
                    })}
											
											
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
