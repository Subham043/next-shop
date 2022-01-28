import Link from 'next/link'

export default function index({link}) {
  return <div class="gray py-3 margin-top-custom">
  <div class="container">
      <div class="row">
          <div class="colxl-12 col-lg-12 col-md-12">
              <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                      <li class="breadcrumb-item"><Link href='/products'><a>Home</a></Link></li>
                      <li class="breadcrumb-item active" aria-current="page">{link}</li>
                  </ol>
              </nav>
          </div>
      </div>
  </div>
</div>;
}
