import { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export default function Index() {

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

    useEffect(() => {
        if (emblaApi) {
            // Embla API is ready
        }
    }, [emblaApi])

    return <div className="home-slider margin-bottom-0" style={{paddingTop:'65px'}}>
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                <div className="embla__slide">
                    <div className="item" style={{backgroundImage:`url('/img/b-3.png')`}}>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="home-slider-container">

                                        <div className="home-slider-desc">
                                            <div className="home-slider-title mb-4">
                                                <h5 className="theme-cl fs-sm ft-ragular mb-0">Winter Collection</h5>
                                                <h1 className="mb-1 ft-bold lg-heading">New Winter<br />Collections 2021</h1>
                                                <span className="trending">There&apos;s nothing like trend</span>
                                            </div>

                                            <a href="#" className="btn stretched-link borders">Shop Now<i className="lni lni-arrow-right ml-2"></i></a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="embla__slide">
                    <div style={{backgroundImage:`url('/img/b-5.png')`}} className="item">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="home-slider-container">

                                        <div className="home-slider-desc">
                                            <div className="home-slider-title mb-4">
                                                <h5 className="theme-cl fs-sm ft-ragular mb-0">Winter Collection</h5>
                                                <h1 className="mb-1 ft-bold lg-heading">New Winter<br />Collections 2021</h1>
                                                <span className="trending">There&apos;s nothing like trend</span>
                                            </div>

                                            <a href="#" className="btn stretched-link borders">Shop Now<i className="lni lni-arrow-right ml-2"></i></a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="embla__slide">
                    <div style={{backgroundImage:`url('/img/b-1.png')`}} className="item">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="home-slider-container">

                                    <div className="home-slider-desc">
                                        <div className="home-slider-title mb-4">
                                            <h5 className="theme-cl fs-sm ft-ragular mb-0">Winter Collection</h5>
                                            <h1 className="mb-1 ft-bold lg-heading">New Winter<br />Collections 2021</h1>
                                            <span className="trending">There&apos;s nothing like trend</span>
                                        </div>

                                        <a href="#" className="btn stretched-link borders">Shop Now<i className="lni lni-arrow-right ml-2"></i></a>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>;
}
