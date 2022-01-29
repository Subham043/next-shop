import Link from 'next/link'


export default function index({ cartSection }) {

	const openCartHandler = () => {
		cartSection.current.style.display = 'block';
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
										<i className="lni lni-shopping-basket"></i><span className="dn-counter">0</span>
									</a>
								</li>
								</ul>
							</div>
						</div>
						<div className="nav-menus-wrapper" style={{transitionProperty: 'none'}}>
							<ul className="nav-menu">
								
								<li><Link href={`/products`}><a>Product</a></Link></li>
								<li><Link href={`/kid`}><a>Kid</a></Link></li>
								<li><Link href={`/address`}><a>Address</a></Link></li>
								
							</ul>
							
							<ul className="nav-menu nav-menu-social align-to-right">
								<li>
									<a href="#" onClick={openCartHandler}>
										<i className="lni lni-shopping-basket"></i><span className="dn-counter">3</span>
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
