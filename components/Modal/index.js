

export default function index({ modalId, refValue, children }) {
    return <div>
        <div className="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="loginmodal" aria-hidden="true">
            <div className="modal-dialog modal-xl login-pop-form" role="document">
                <div className="modal-content" id="loginmodal">
                    <div className="modal-headers">
                        <button type="button" ref={refValue} className="close" data-dismiss="modal" aria-label="Close">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="modal-body p-5">
                        {children}

                    </div>
                </div>
            </div>
        </div>
    </div>;
}
