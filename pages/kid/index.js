import Head from 'next/head'
import Layout from '../../components/Layout'
import { useState, useEffect, useRef } from 'react'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/Breadcrumb'
import Modal from '../../components/Modal'
import { toast, ToastContainer } from 'react-toastify';
import axios from '../../axios'
import useSWR from 'swr'
import constant from '../../constant'

export default function Kid() {

    const [showLoader, setShowLoader] = useState(true)
    const [student, setStudent] = useState([])
    const [school, setSchool] = useState([])

    const modalCloseBtn= useRef(null);

    const [name, setName] = useState('')
    const [nameError, setNameError] = useState(false)
    const [nameErrorMsg, setNameErrorMsg] = useState('')

    const [gender, setGender] = useState('Male')

    const [schoolId, setSchoolId] = useState('')
    const [schoolIdError, setSchoolIdError] = useState(false)
    const [schoolIdErrorMsg, setSchoolIdErrorMsg] = useState('')


    const fetcher = (...args) => fetch(...args, {
        headers: {
            'authorization': 'bearer ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8zNS4xNTQuMjA5LjE4XC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNjQzMzkwMjkxLCJleHAiOjE2NDQwNzY2OTEsIm5iZiI6MTY0MzM5MDI5MSwianRpIjoiUm9VUWpNaFVubWVSdnl1MyIsInN1YiI6NywicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.qzskxa9GVdwCgLuzaOKHHhGh-vO83hyZwhwbKZ21fxk",
        },
    }).then((res) => res.json())

    const { data:schoolData, error:schoolError } = useSWR(`${constant.api_route}/get-school`, fetcher)
    const { data:studentData, error:studentError } = useSWR(`${constant.api_route}/get-kid`, fetcher)




    useEffect(() => {
        if (schoolError || studentError) {
            toast.error('Something went wrong. Please refresh the page', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
            });
        }

        return () => { };
    }, [schoolError, studentError]);

    useEffect(() => {
        if (!schoolData) {
            setShowLoader(true)
        } else {
            setShowLoader(false)
            // console.log(data.data.schools)
            setSchool(schoolData?.data?.schools)
            setSchoolId(schoolData?.data?.schools[0]?.id)
        }

        return () => { };
    }, [schoolData]);

    useEffect(() => {
        if (!studentData) {
            setShowLoader(true)
        } else {
            setShowLoader(false)
            // console.log(studentData.data)
            setStudent(studentData?.data?.kids)
            // setStudent(studentData?.data?.schools)
        }

        return () => { };
    }, [studentData]);

    const nameHandler = (text) =>{
        setName(text) 
        if (text == '') {
          setNameError(true) 
          setNameErrorMsg('Please enter a name') 
          return;
        } else if (!(/^[a-zA-Z\s]*$/.test(text))) {
          setNameError(true)
          setNameErrorMsg('please enter a valid name')  
          return;
        } else {
          setNameError(false)
          setNameErrorMsg('')  
        }
      }

      const genderHandler = (text) =>{
        setGender(text)
      }

      const schoolIdHandler = (text) =>{
        setSchoolId(text)
        if (text == '') {
            setSchoolIdError(true) 
            setSchoolIdErrorMsg('Please select a school') 
            return;
        }
      }

      const addKidHandler = async (e) =>{
        e.preventDefault()

        if (name == '') {
            setNameError(true) 
            setNameErrorMsg('Please enter a name') 
            return;
        }

        if (schoolId == '') {
            setSchoolIdError(true) 
            setSchoolIdErrorMsg('Please select a school') 
            return;
        }

        if(nameError){
            setNameError(true) 
            setNameErrorMsg('Please enter a name')
            return;
        }

        if(schoolIdError){
            setSchoolIdError(true) 
            setSchoolIdErrorMsg('Please select a school') 
            return;
        }

        const formData = new FormData();
        formData.append('school_id',schoolId);
        formData.append('gender',gender);
        formData.append('name',name);
        setShowLoader(true)

        axios.post('/add-kid',formData, {
            headers: {
                'authorization': 'bearer ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8zNS4xNTQuMjA5LjE4XC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNjQzMzkwMjkxLCJleHAiOjE2NDQwNzY2OTEsIm5iZiI6MTY0MzM5MDI5MSwianRpIjoiUm9VUWpNaFVubWVSdnl1MyIsInN1YiI6NywicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.qzskxa9GVdwCgLuzaOKHHhGh-vO83hyZwhwbKZ21fxk",
            },
        })
        .then(res => {
            setShowLoader(false)
            // console.log(res);
            getStudentDataHandler()
            toast.success('Added Successfully.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
              });
              setName('')
              setSchoolId(schoolData?.data?.schools[0]?.id)
              setGender('Male')
              modalCloseBtn.current.click();
        })
        .catch(err => {
            setShowLoader(false)
            console.log(err);
            toast.error(err?.response?.data?.data, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
              });
              
        })
        setNameError(false)
        setNameErrorMsg('')
        setSchoolIdError(false)
        setSchoolIdErrorMsg('')

      }

      const getStudentDataHandler = () =>{
        setShowLoader(true)
        axios.get('/get-kid', {
            headers: {
                'authorization': 'bearer ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8zNS4xNTQuMjA5LjE4XC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNjQzMzkwMjkxLCJleHAiOjE2NDQwNzY2OTEsIm5iZiI6MTY0MzM5MDI5MSwianRpIjoiUm9VUWpNaFVubWVSdnl1MyIsInN1YiI6NywicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.qzskxa9GVdwCgLuzaOKHHhGh-vO83hyZwhwbKZ21fxk",
            },
        })
        .then(res => {
            setShowLoader(false)
            // console.log(res);
            setStudent(res?.data?.data?.kids)
        })
        .catch(err => {
            setShowLoader(false)
            console.log(err);
            toast.error(err?.response?.data?.data, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                toastId: new Date()
              });
              
        })
      }






    return (
        <Layout>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {showLoader ? <Loader /> : null}
            <Breadcrumb link="Kid" />

            <section className="middle" id="prduct">
                <div className="container">

                    <div className="form-group">
                        <div className="d-flex align-items-center justify-content-between">
                            <h2 className="ft-bold mb-1">Kids</h2>
                            <div className="eltio_k2">
                                <a href="#" data-toggle="modal" data-target="#login1" className="btn btn-block custom-height bg-dark mb-2">
                                    <i className="lni lni-shopping-basket mr-2"></i>Add Kid
                                </a>
                            </div>
                        </div>
                        <hr />
                    </div>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr className="table-dark">
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">School</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.map((item, index)=>{
                                return (
                                <tr key={item.id}>
                                    <th scope="row">{index}</th>
                                    <td>{item.name}</td>
                                    <td>{item.schoolName}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
            <Modal modalId="login1" refValue={modalCloseBtn}>
                <div className="text-center mb-4">
                    <h2 className="m-0 ft-regular">Add Kid</h2>
                </div>

                <form>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" placeholder="Name*" value={name} onChange={(e)=>nameHandler(e.target.value)} />
                        {nameError ? <i style={{ color: 'red' }}>{nameErrorMsg}</i>:null}
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select className="mb-2 custom-select" id="size_select" value={gender} onChange={(e)=>genderHandler(e.target.value)} >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>School</label>
                        <select className="mb-2 custom-select" id="size_select1" value={schoolId} onChange={(e)=>schoolIdHandler(e.target.value)}>
                            {school.map((item)=>{
                                return <option value={item?.id} key={item.id}>{item?.name}</option>
                            })}
                            
                        </select>
                        {schoolIdError ? <i style={{ color: 'red' }}>{schoolIdErrorMsg}</i>:null}
                    </div>

                    <div className="form-group">
                        <button onClick={(e)=>addKidHandler(e)} className="btn btn-md full-width bg-dark text-light fs-md ft-medium">Add</button>
                    </div>

                </form>
            </Modal>
            <ToastContainer />
        </Layout>
    )
}
