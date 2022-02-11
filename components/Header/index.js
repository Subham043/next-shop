import Link from 'next/link'
import { useCookies } from "react-cookie"
import Router from 'next/router'
import { useSelector } from "react-redux"
import { selectCart } from "../../redux/feature/cartSlice"
import axios from '../../axios';



export default function Index({ cartSection, userToken }) {

	const [cookies, setCookie, removeCookie] = useCookies(["userToken"])
	const cartRedux = useSelector(selectCart)

	const openCartHandler = () => {
		cartSection.current.style.display = 'block';
	}

	const logoutHandler = () => {
		axios.get('/logout', {
			headers: {
				'authorization': 'bearer ' + JSON.parse(userToken.userToken),
			},
		})
			.then(res => {
				// console.log(res.data);
				removeCookie("userToken");
				Router.push('/')
			})
			.catch(err => {
				console.log(err);
				if (err?.response?.data?.message == 'Token is Invalid' || err?.response?.data?.message == 'Token is Expired' || err?.response?.data?.message == 'Authorization Token not found') {
					removeCookie("userToken");
					Router.push('/')
				}

			})
		
	}

	return <div>
		<div className="header header-transparent dark-text">
			<div className="container">
				<nav id="navigation" className="navigation navigation-landscape">
					<div className="nav-header">
						<a className="nav-brand" href="#">
							<img src="/img/logo.png" className="logo" alt="Logo" />
						</a>
						<div className="nav-toggle"></div>
						<div className="mobile_nav">
							<ul>

								<li>
									<a href="#" onClick={openCartHandler}>
										<i className="lni lni-shopping-basket"></i><span className="dn-counter">{cartRedux.cartCounter}</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="nav-menus-wrapper" style={{ transitionProperty: 'none' }}>
						<ul className="nav-menu">

							<li><Link href={`/products`}><a>Product</a></Link></li>
							<li><Link href={`/kid`}><a>Kid</a></Link></li>
							<li><Link href={`/address`}><a>Address</a></Link></li>
							<li><Link href={`/orders`}><a>Orders</a></Link></li>
							<li><button onClick={logoutHandler}>Logout</button></li>

						</ul>

						<ul className="nav-menu nav-menu-social align-to-right">
							<li>
								<a href="#" onClick={openCartHandler}>
									<i className="lni lni-shopping-basket"></i><span className="dn-counter">{cartRedux.cartCounter}</span>
								</a>
							</li>
						</ul>
					</div>
				</nav>
			</div>
		</div>
		<div className="clearfix"></div>
	</div>;
}
