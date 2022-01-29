import Link from 'next/link'

export default function index({link}) {
  return <div className="gray py-3 margin-top-custom">
  <div className="container">
      <div className="row">
          <div className="colxl-12 col-lg-12 col-md-12">
              <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                      <li className="breadcrumb-item"><Link href='/products'><a>Home</a></Link></li>
                      <li className="breadcrumb-item active" aria-current="page">{link}</li>
                  </ol>
              </nav>
          </div>
      </div>
  </div>
</div>;
}
