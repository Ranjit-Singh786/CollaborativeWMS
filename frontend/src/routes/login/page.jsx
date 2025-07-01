import React,{useState,useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from "axios";

const LoginPage = () => {
  const [user, setUser] = React.useState({});

    const navigate = useNavigate();
    
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async(values) => {
      console.log('Form submitted:', values);
      try {
        const baseUrl = "https://collaborative-wms-bakend.vercel.app" || 'http://localhost:5000';
        const response = await axios.post(baseUrl+'/api/auth/login', {
          email: values.email,
          password: values.password,
        });

      if(response?.data?.status==201){
        setUser(response?.data?.user);
        localStorage.setItem("token",response?.data?.token);
        localStorage.setItem("role",response?.data?.user?.role);
        localStorage.setItem("user",JSON.stringify(response?.data?.user));
       
        Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'You will be redirected shortly.',
            showConfirmButton: false,
            timer: 2000, // Auto-close after 2 seconds
          }).then(() => {
            navigate('/'); // Redirect to home route after success
          });
      }
       
      } catch (error) {
        console.log(error);
        Swal.fire({
            icon: 'failed',
            title: 'Login Unsuccessful!',
            text: '',
            showConfirmButton: false,
            timer: 2000, // Auto-close after 2 seconds
          });
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 border border-gray-300 rounded-md mt-2 ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500'
                  : ''
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 border border-gray-300 rounded-md mt-2 ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500'
                  : ''
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:text-blue-700">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
