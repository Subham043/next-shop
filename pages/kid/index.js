import Head from 'next/head'
import Layout from '../../components/Layout'
import { useState, useEffect, useRef } from 'react'
import Loader from '../../components/Loader'
import Breadcrumb from '../../components/Breadcrumb'
import { toast } from 'react-toastify';
import axios from '../../axios'
import useSWR from 'swr'
import constant from '../../constant'
import { parseCookies } from "../../helper/cookiedHelper"
import { useCookies } from "react-cookie"
import Router from 'next/router'
import KidModal from '../../components/KidModal'

export default function Kid({userToken}) {

    const [showLoader, setShowLoader] = useState(true)
    const [student, setStudent] = useState([])
    const [school, setSchool] = useState([])
    const [clasSelect, setClasSelect] = useState([])
    const [sectionSelect, setSectionSelect] = useState([])

    const [cookies, setCookie, removeCookie] = useCookies(["userToken"])

    const modalCloseBtn= useRef(null);
    const cartSection= useRef(null);

    const [name, setName] = useState('')
    const [nameError, setNameError] = useState(false)
    const [nameErrorMsg, setNameErrorMsg] = useState('')

    const [gender, setGender] = useState('Male')

    const [schoolId, setSchoolId] = useState('')
    const [schoolIdError, setSchoolIdError] = useState(false)
    const [schoolIdErrorMsg, setSchoolIdErrorMsg] = useState('')

    const [section, setSection] = useState('')
    const [sectionError, setSectionError] = useState(false)
    const [sectionErrorMsg, setSectionErrorMsg] = useState('')

    const [clas, setClas] = useState('')
    const [clasError, setClasError] = useState(false)
    const [clasErrorMsg, setClasErrorMsg] = useState('')


    const fetcher = (...args) => fetch(...args, {
        headers: {
            'authorization': 'bearer ' + JSON.parse(userToken.userToken),
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
            if(schoolData?.message=='Token is Invalid' || schoolData?.message=='Token is Expired' || schoolData?.message=='Authorization Token not found'){
                removeCookie("userToken");
                Router.push('/')
              }
            setSchool(schoolData?.data?.schools)
            if(schoolData?.data?.schools?.length > 0) {
                setSchoolId(schoolData?.data?.schools[0]?.school?.id)
                setClasSelect(schoolData?.data?.schools[0]?.classes)
                setClas(schoolData?.data?.schools[0]?.classes[0]?.id)
                getSectionDataHandler(schoolData?.data?.schools[0]?.school?.id,schoolData?.data?.schools[0]?.classes[0]?.id)
            }
        }

        return () => { };
    }, [schoolData]);

    useEffect(() => {
        if (!studentData) {
            setShowLoader(true)
        } else {
            setShowLoader(false)
            // console.log(studentData.data)
            if(studentData?.message=='Token is Invalid' || studentData?.message=='Token is Expired' || studentData?.message=='Authorization Token not found'){
                removeCookie("userToken");
                Router.push('/')
              }
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

      const sectionHandler = (text) =>{
        setSection(text) 
        if (text == '') {
          setSectionError(true) 
          setSectionErrorMsg('Please enter a section') 
          return;
        } else if (!(/^[0-9]*$/.test(text))) {
          setSectionError(true)
          setSectionErrorMsg('please enter a valid section')  
          return;
        } else {
          setSectionError(false)
          setSectionErrorMsg('')  
        }
      }

      const clasHandler = (text) =>{
        setClas(text)
        getSectionDataHandler(schoolId,text)
        if (text == '') {
            setClasError(true) 
            setClasErrorMsg('Please select a class') 
            return;
        }
      }

      const genderHandler = (text) =>{
        setGender(text)
      }

      const schoolIdHandler = (text) =>{
        setSchoolId(text)
        let mainIndex = school.findIndex((item,index)=> item?.school?.id==text)
        setClasSelect(school[mainIndex]?.classes)
        setClas(school[mainIndex]?.classes[0]?.id)
        getSectionDataHandler(text,school[mainIndex]?.classes[0]?.id)
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

        if (clas == '') {
            setClasError(true) 
            setClasErrorMsg('Please enter a class') 
            return;
        }

        if (section == '') {
            setSectionError(true) 
            setSectionErrorMsg('Please enter a section') 
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

        if(clasError){
            setClasError(true) 
            setClasErrorMsg('Please enter a class')
            return;
        }

        if(sectionError){
            setSectionError(true) 
            setSectionErrorMsg('Please enter a section')
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
        formData.append('class_id',clas);
        formData.append('section_id',section);
        setShowLoader(true)

        axios.post('/add-kid',formData, {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
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
              if(schoolData?.data?.schools.length > 0){
                  setSchoolId(schoolData?.data?.schools[0]?.id)
              }
              setGender('Male')
              modalCloseBtn.current.click();
        })
        .catch(err => {
            setShowLoader(false)
            console.log(err);
            if(err?.response?.data?.message=='Token is Invalid' || err?.response?.data?.message=='Token is Expired' || err?.response?.data?.message=='Authorization Token not found'){
                removeCookie("userToken");
                Router.push('/')
              }
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
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
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
            if(err?.response?.data?.message=='Token is Invalid' || err?.response?.data?.message=='Token is Expired' || err?.response?.data?.message=='Authorization Token not found'){
                removeCookie("userToken");
                Router.push('/')
              }
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

      const getSectionDataHandler = (sId, cId) =>{
        setShowLoader(true)
        axios.get(`/get-school-section-by-school-and-class/${sId}/${cId}`, {
            headers: {
                'authorization': 'bearer ' + JSON.parse(userToken.userToken),
              },
        })
        .then(res => {
            setShowLoader(false)
            // console.log(res);
            setSectionSelect(res?.data?.data?.schoolSections)
            if(res?.data?.data?.schoolSections?.length > 0){
              setSection(res?.data?.data?.schoolSections[0]?.id)
            }
        })
        .catch(err => {
            setShowLoader(false)
            console.log(err);
            if(err?.response?.data?.message=='Token is Invalid' || err?.response?.data?.message=='Token is Expired' || err?.response?.data?.message=='Authorization Token not found'){
                removeCookie("userToken");
                Router.push('/')
              }
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
        <Layout cartSection={cartSection} userToken={userToken}>
            <Head>
                <title>Cotton Culture</title>
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
                                    <i className="fas fa-user mr-2"></i>Add Kid
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
                                <th scope="col">Gender</th>
                                <th scope="col">School</th>
                                <th scope="col">Class</th>
                                <th scope="col">Section</th>
                            </tr>
                        </thead>
                        {student?.length > 0 ? <tbody>
                            {student.map((item, index)=>{
                                return (
                                <tr key={item.id}>
                                    <th scope="row">{index+1}</th>
                                    <td>{item.name}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.schoolName}</td>
                                    <td>{item.className}</td>
                                    <td>{item.sectionName}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                        :
                        <tbody>
                          <tr>
                            <th scope="row" colSpan="8" className="text-center">No kid is available. Please add a kid</th>
                          </tr>
                        </tbody>
                      }
                    </table>
                </div>
            </section>

            <KidModal modalCloseBtn={modalCloseBtn} name={name} nameError={nameError} nameErrorMsg={nameErrorMsg} nameHandler={nameHandler} gender={gender} genderHandler={genderHandler} schoolId={schoolId} school={school} schoolIdError={schoolIdError} schoolIdHandler={schoolIdHandler} clasErrorMsg={clasErrorMsg} clas={clas} clasSelect={clasSelect} clasHandler={clasHandler} clasError={clasError} section={section} sectionError={sectionError} sectionErrorMsg={sectionErrorMsg} sectionHandler={sectionHandler} sectionSelect={sectionSelect} addKidHandler={addKidHandler} />
            
        </Layout>
    )
}


export async function getServerSideProps(context) {

    const data = parseCookies(context.req)
  
      if(data?.userToken==undefined){
        return {
          redirect: {
            permanent: false,
            destination: "/"
          }
      }
      
    }
  
    return {
          props: {
              userToken: data && data,
          }, // will be passed to the page component as props
      }
  }