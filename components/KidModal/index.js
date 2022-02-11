import Modal from '../Modal'

export default function Index({ modalCloseBtn, name, nameError, nameErrorMsg, nameHandler, gender, genderHandler, schoolId, school, schoolIdError, schoolIdHandler, clas, clasSelect, clasHandler, clasError, clasErrorMsg, section, sectionError, sectionErrorMsg, sectionHandler, addKidHandler }) {
    return <Modal modalId="login1" refValue={modalCloseBtn}>
        <div className="text-center mb-4">
            <h2 className="m-0 ft-regular">Add Kid</h2>
        </div>

        <form>
            <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" placeholder="Name*" value={name} onChange={(e) => nameHandler(e.target.value)} />
                {nameError ? <i style={{ color: 'red' }}>{nameErrorMsg}</i> : null}
            </div>
            <div className="form-group">
                <label>Gender</label>
                <select className="mb-2 custom-select" id="size_select" value={gender} onChange={(e) => genderHandler(e.target.value)} >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div className="form-group">
                <label>School</label>
                <select className="mb-2 custom-select" id="size_select1" value={schoolId} onChange={(e) => schoolIdHandler(e.target.value)}>
                    {school.map((item) => {
                        return <option value={item?.school?.id} key={item?.school?.id}>{item?.school?.name}</option>
                    })}

                </select>
                {schoolIdError ? <i style={{ color: 'red' }}>{schoolIdErrorMsg}</i> : null}
            </div>
            <div className="form-group">
                <label>Class</label>
                <select className="mb-2 custom-select" id="size_select1" value={clas} onChange={(e) => clasHandler(e.target.value)}>
                    {clasSelect.map((item) => {
                        return <option value={item?.id} key={item?.id}>{item?.name}</option>
                    })}

                </select>
                {clasError ? <i style={{ color: 'red' }}>{clasErrorMsg}</i> : null}
            </div>
            <div className="form-group">
                <label>Section</label>
                <input type="text" className="form-control" placeholder="Section*" value={section} onChange={(e) => sectionHandler(e.target.value)} />
                {sectionError ? <i style={{ color: 'red' }}>{sectionErrorMsg}</i> : null}
            </div>

            <div className="form-group">
                <button onClick={(e) => addKidHandler(e)} className="btn btn-md full-width bg-dark text-light fs-md ft-medium">Add</button>
            </div>

        </form>
    </Modal>
}