// src/components/SignUpPage.js
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Page = () => {
     const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async(values) => {
      // Handle form submission here
      console.log('Form submitted:', values);
      try {
        const response = await axios.post("https://collaborative-wms-bakend.vercel.app"+'/api/auth/register', {
          email: values.email,
          password: values.password,
          name: values.name,
        });

      if(response?.data?.status==201){
        Swal.fire({
            icon: 'success',
            title: 'Signup Successful!',
            text: 'You will be redirected shortly.',
            showConfirmButton: false,
            timer: 2000, // Auto-close after 2 seconds
          }).then(() => {
            navigate('/login'); // Redirect to home route after success
          });
      }
       
      } catch (error) {
        console.log(error.response.data?.error);
        Swal.fire({
            icon: 'failed',
            title: 'Login Unsuccessful!',
            text: error.response?.data?.message,
            showConfirmButton: false,
            timer: 2000, // Auto-close after 2 seconds
          });
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 border border-gray-300 rounded-md mt-2 ${
                formik.touched.name && formik.errors.name
                  ? 'border-red-500'
                  : ''
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

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
          <div className="mb-4">
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

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 border border-gray-300 rounded-md mt-2 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? 'border-red-500'
                  : ''
              }`}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-700">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
