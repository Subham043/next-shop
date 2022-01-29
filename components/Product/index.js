import React from 'react';
import constant from '../../constant'
import Link from 'next/link'

export default function index({item}) {


    return <div className="col-xl-3 col-lg-4 col-md-6 col-6">
        <Link href={`/products/${item.id}`}><a><div className="product_grid card b-0">
            <div className="card-body p-0">
                <div className="shop_thumb position-relative">
                   <img className="card-img-top" src={`${constant.api_image_route}/${item.image}`} alt="..." />
                    {/* <div className="product-hover-overlay d-flex align-items-center justify-content-between">
                        <div className="edlio" style={{cursor: "pointer"}} onClick={()=>addCartHandler(item)}><div className="text-underline fs-sm ft-bold snackbar-addcart">Add To Cart</div></div>
                    </div> */}
                </div>
            </div>
            <div className="card-footer b-0 p-0 pt-2 bg-white d-flex align-items-start justify-content-between">
                <div className="text-left">
                    <div className="text-left">
                        <div className="star-rating align-items-center d-flex justify-content-left mb-1 p-0">
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star filled"></i>
                            <i className="fas fa-star"></i>
                        </div>
                        <h5 className="fs-md mb-0 lh-1 mb-1"> {item.name} </h5>
                    </div>
                </div>
            </div>
        </div></a></Link>
    </div>;
}
