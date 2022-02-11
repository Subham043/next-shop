import React from 'react';
import constant from '../../constant'

export default function Index({item}) {
    return (
        <div className="d-flex align-items-center justify-content-between br-bottom px-3 py-3">
            <div className="cart_single d-flex align-items-center">
                <div className="cart_selected_single_thumb">
                    <a href="#"><img src={`${constant.api_image_route}/${item.productImage}`} width="60" className="img-fluid" alt="" /></a>
                </div>
                <div className="cart_single_caption pl-2">
                    <h4 className="product_title fs-medium ft-medium mb-0 lh-1">{item.productName}</h4>
                    <div className="d-flex align-items-center" style={{flexWrap:'wrap'}}>
                        <p className="mb-2 mr-2"><span className="text-dark ft-medium">Quantity : </span> <span className="text-dark ">{item.quantity}</span>, </p>
                        <p className="mb-2 mr-2"><span className="text-dark ft-medium ">Size : </span> <span className="text-dark ">{item.size}</span>, </p>
                        <p className="mb-2 mr-2"><span className="text-dark ft-medium ">Gender : </span> <span className="text-dark ">{item.productGender}</span>, </p>
                        <p className="mb-2 mr-2"><span className="text-dark ft-medium ">Kid : </span> <span className="text-dark ">{item.kidName}</span>, </p>
                        <p className="mb-2 mr-2"><span className="text-dark ft-medium ">School : </span> <span className="text-dark ">{item.schoolName}</span>, </p>
                        <p className="mb-2 mr-2"><span className="text-dark ft-medium ">Payment Mode : </span> <span className="text-dark ">{item.paymentModeName}</span>, </p>
                        <p className="mb-2 mr-2"><span className="text-dark ft-medium ">Order Status : </span> <span className="text-dark ">{item.orderStatus}</span>, </p>
                    </div>
                    <h4 className="fs-md ft-medium mb-0 lh-1">Rs. ${item.price}</h4>
                </div>
            </div>
        </div>
    );
}
