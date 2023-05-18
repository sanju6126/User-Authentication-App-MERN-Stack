// import React from 'react'

// // insted of anchor tag we are using the Link component of react router dom because whenever we click on the anchor tag it is going to relaod the browser this is not how the SINGLE PAGE APPLICATION WORKS
// // so here whenver we click on the Link we ae just rediected to the Register page without the page being loaded
// import { Link, useNavigate } from 'react-router-dom'
// import avatar from '../assets/profile.png'

// import styles from '../styles/Username.module.css'

// //formik and react-hot-toast will help us in validating and  displaying the error messages and success messages
// import { useFormik } from 'formik'      //this will help in validating ans aaccessing the user data from the form
// import toast, { Toaster } from 'react-hot-toast'
// import { passwordValidate } from '../helper/validate'

// import useFetch from '../hooks/fetch.hook'
// import { useAuthStore } from '../store/store'
// import { verifyPassword } from '../helper/helper'




// function Password() {

//   const navigate = useNavigate()
//   const username = useAuthStore(state => state.auth)
//   const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username} `)



//   const formik = useFormik({
//     initialValues: {
//       password: '',       //this property name has to filled when the input box is filled...that's why below in the div textbox we have used this variable name
//     },

//     validate: passwordValidate,
//     // these below two statements are rquired to validate the inout box in the form when the submit button is clicked 
//     validateOnBlur:false,
//     validateOnChange:false,
//     onSubmit: async values => {
//       // console.log(values)

//       let loginPromise = verifyPassword({ username, password: values.password})
//       toast.promise(loginPromise, {
//         loading:'Checking password',
//         success: <b>Login Successfully...</b>,
//         error: <b>Password Does not match</b>
//       });

//       loginPromise.then(res => {
//         let { token } = res.data;
//         localStorage.setItem('token', token);
//         navigate('/profile')
//       })

//     }
//   });
 
//   if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
//   if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1> 


//   return (
//     <div className='container mx-auto'>

//       {/* placing the toast */}
//       <Toaster position='top-center' reverseOrder={false} />

//       <div className='flex justify-center items-center h-screen'>
//         <div className={styles.glass}>
          
//           <div className='title flex flex-col items-center'>
//             <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
//             <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
//               Explore more by connecting with us!.
//             </span>
//           </div>

//           <form className='py-1' onSubmit={formik.handleSubmit}>
//             <div className='profile flex justify-center py-4'>
//               <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar"/>
//             </div>

//             <div className='textbox flex flex-col items-center gap-6'>
//               <input {...formik.getFieldProps('password')} className={styles.textbox} type='text' placeholder='Password'/>
//               <button className={styles.btn} type='submit'>Sign In</button>
//             </div>

//             <div className='text-center py-4'>
//               <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to='/recovery'>Recovery Now</Link></span>
//             </div>

//           </form>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default Password












import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate'
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'
import styles from '../styles/Username.module.css';

export default function Password() {

  const navigate = useNavigate()
  const {username}  = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)

  console.log({apiData});

  const formik = useFormik({
    initialValues : {
      password : 'admin@123'
    },
    validate : passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      
      let loginPromise = verifyPassword({ username, password : values.password })
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success : <b>Login Successfully...!</b>,
        error : <b>Password Not Match!</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);    //'token' is the key name and another one is the token that we will be getting and w will be saving inside the localaStorage
        navigate('/profile')
      })
    }
  })

  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello {username || apiData?.firstName}</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>

          <div className='profile flex justify-center py-4'>
                  <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
              {/* <div className='profile flex justify-center py-4'>
                  <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
              </div> */}

              <div className="textbox flex flex-col items-center gap-6">
                  <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password' />
                  <button className={styles.btn} type='submit'>Sign In</button>
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to="/recovery">Recover Now</Link></span>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}