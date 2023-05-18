import React ,{ useState } from 'react'
import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'

//formik and react-hot-toast will help us in validating and  displaying the error messages and success messages
import { useFormik } from 'formik'      //this will help in validating ans aaccessing the user data from the form
import toast, { Toaster } from 'react-hot-toast'
import { profileValidate } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import useFetch from '../hooks/fetch.hook'
// import { useAuthStore } from '../store/store'
import { updateUser } from '../helper/helper'
import { useNavigate } from 'react-router-dom'





function Profile() {

  const navigate = useNavigate();

  const [file,setFile] = useState();
  // const {username}  = useAuthStore(state => state.auth)
  // const [{ isLoading, apiData, serverError }]  = useFetch(`/user/${username}`);
  const [{ isLoading, apiData, serverError }]  = useFetch();

  console.log(apiData);

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName ||  '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || '',
      email: apiData?.email || ''
    },

    enableReinitialize: true,
    validate: profileValidate,
    // these below two statements are rquired to validate the inout box in the form when the submit button is clicked 
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values);
      // console.log(updatePromise)

      toast.promise(updatePromise, {
        loading: 'Updating Profile...',
        success: <b>Updated Successfully...!</b>,
        error: <b>Could not Update!</b>
      })

      // console.log(values)
    }
  }); 


  // to show the profile image in the box first we need to ge the value from the input type file
  // formik does not support file upload so we need to create this handler
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0])   //here we convert the image into base64 and store that inside the base64 variable
    setFile(base64);

  } 

  //logout handler function
  function logoutHandler(){
    localStorage.removeItem('token');
    navigate('/');
  }


  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>


  return (
    <div className='container mx-auto'>

      {/* placing the toast */}
      <Toaster position='top-center' reverseOrder={false} />

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{width:"30%"}}>
          
          <div className='title flex flex-col items-center'>
            <h4 className='py-0 text-4xl font-bold'>Profile!</h4>
            <span className='py-3 text-xl w-2/3 text-center text-gray-500'>
              You can Update Details!.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-1'>
              <label htmlFor="profile">
                <img src={apiData?.profile || file || avatar} className={styles.profile_img} alt="avatar"/>
              </label>

              <input onChange={onUpload} type="file" id="profile" name='profile'/>
            </div>

            <div className='textbox flex flex-col items-center gap-3'>
              <div className='name flex w-3/4 gap-6'>
                <input {...formik.getFieldProps('firstName')} className={styles.textbox} type='text' placeholder='FirstName'/>
                <input {...formik.getFieldProps('lastName')} className={styles.textbox} type='text' placeholder='LastName'/>
              </div>

              <div className='name flex w-3/4 gap-6'>
                <input {...formik.getFieldProps('mobile')} className={styles.textbox} type='text' placeholder='Mobile No.'/>
                <input {...formik.getFieldProps('email')} className={styles.textbox} type='text' placeholder='Email*'/>
              </div>

                <input {...formik.getFieldProps('address')} className={styles.textbox} type='text' placeholder='Address'/>
                <button className={styles.btn} type='submit'>Update</button>
                         
            </div>

            <div className='text-center py-1'>
              <span className='text-gray-500'>Come back later! <button onClick={logoutHandler} className='text-red-500' to='/'>Log Out</button></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Profile



// //*************FOR CHANGING THE PROFILE IMAGE IN THE FRONTEND*************
// // at first image will be selected from the input box then the onUpload function will be called 
// // where the image will be converted to base64 and stored in the base64 variable 
// // (e.target.files[0] will select the first image from the files list) and then the base64 will be assigned to setFile 
// // and then through the setFile that will be assigned to the file variable and that file variable is going to change the image in the frontend
