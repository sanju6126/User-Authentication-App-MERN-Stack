import React from 'react'
import styles from '../styles/Username.module.css'

//formik and react-hot-toast will help us in validating and  displaying the error messages and success messages
import { useFormik } from 'formik'      //this will help in validating ans aaccessing the user data from the form
import { Toaster } from 'react-hot-toast'
import { resetPasswordValidate } from '../helper/validate'




function Reset() {

  const formik = useFormik({
    initialValues: {
      password: '',       //this property name has to filled when the input box is filled...that's why below in the div textbox we have used this variable name
      confirm_pwd: ''

    },

    validate: resetPasswordValidate,
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
      <Toaster position='top-center' reverseOrder={false} />

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{width:"30%"}}>
          
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Reset!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter new password!.
            </span>
          </div>

          <form className='py-20' onSubmit={formik.handleSubmit}>
            
            <div className='textbox flex flex-col items-center gap-6'>
              <input {...formik.getFieldProps('password')} className={styles.textbox} type='text' placeholder='New Password'/>
              <input {...formik.getFieldProps('confirm_pwd')} className={styles.textbox} type='text' placeholder='Confirm Password'/>

              <button className={styles.btn} type='submit'>Reset</button>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Reset