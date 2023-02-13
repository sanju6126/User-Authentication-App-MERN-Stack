import React from 'react'

// insted of anchor tag we are using the Link component of react router dom because whenever we click on the anchor tag it is going to relaod the browser this is not how the SINGLE PAGE APPLICATION WORKS
// so here whenver we click on the Link we ae just rediected to the Register page without the page being loaded
import { Link } from 'react-router-dom'
import avatar from '../assets/profile.png'

import styles from '../styles/Username.module.css'  

//formik and react-hot-toast will help us in validating and  displaying the error messages and success messages
 import { useFormik } from 'formik'      //this will help in validating ans aaccessing the user data from the form
 import { Toaster } from 'react-hot-toast'
 import { usernameValidate } from '../helper/validate'




function Username() {

  const formik = useFormik({
    initialValues: {
      username: '',       //this property name has to filled when the input box is filled...that's why below in the div textbox we have used this variable name
    },

    validate: usernameValidate,
    // these below two statements are rquired to validate the inout box in the form when the submit button is clicked 
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit: async values => {
      console.log(values)

    }
    

  });





  return (
    <div className='container mx-auto'>

      {/* placing the toast */}
      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
          
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello Again!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username' />
              <button className={styles.btn} type='submit'>Submit</button>
            </div>

            <div className='text-center py-4'>
              <span className='text-gray-500'>Not a Member? <Link className='text-red-500' to='/register'>Register Now</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Username