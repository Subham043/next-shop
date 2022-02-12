import Modal from '../Modal'


export default function Index({modalCloseBtn , label, labelError, labelErrorMsg, labelHandler, addressInput, addressInputError, addressInputErrorMsg, addressInputHandler, city, cityError, cityErrorMsg, cityHandler, state, stateError, stateErrorMsg, stateHandler, pin, pinError, pinErrorMsg, pinHandler, addAddressHandler}){

    return <Modal modalId="address1" refValue={modalCloseBtn}>
        <div className="text-center mb-4">
          <h2 className="m-0 ft-regular">Add Address</h2>
        </div>

        <form>
          <div className="form-group">
            <label>Label</label>
            <input type="text" className="form-control" placeholder="Label*" value={label} onChange={(e) => labelHandler(e.target.value)} />
            {labelError ? <i style={{ color: 'red' }}>{labelErrorMsg}</i> : null}
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea className="form-control" placeholder="Address*" value={addressInput} onChange={(e) => addressInputHandler(e.target.value)} ></textarea>
            {addressInputError ? <i style={{ color: 'red' }}>{addressInputErrorMsg}</i> : null}
          </div>

          <div className="form-group">
            <label>City</label>
            <input type="text" className="form-control" placeholder="City*" value={city} onChange={(e) => cityHandler(e.target.value)} />
            {cityError ? <i style={{ color: 'red' }}>{cityErrorMsg}</i> : null}
          </div>

          <div className="form-group">
            <label>State</label>
            <input type="text" className="form-control" placeholder="State*" value={state} onChange={(e) => stateHandler(e.target.value)} />
            {stateError ? <i style={{ color: 'red' }}>{stateErrorMsg}</i> : null}
          </div>

          <div className="form-group">
            <label>Pincode</label>
            <input type="text" className="form-control" placeholder="Pincode*" value={pin} onChange={(e) => pinHandler(e.target.value)} />
            {pinError ? <i style={{ color: 'red' }}>{pinErrorMsg}</i> : null}
          </div>

          <div className="form-group">
            <button onClick={(e) => addAddressHandler(e)} className="btn btn-md full-width bg-dark text-light fs-md ft-medium">Add</button>
          </div>

        </form>
      </Modal>


};
