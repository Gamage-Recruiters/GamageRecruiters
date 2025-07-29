import React, { useState, useCallback, memo } from 'react';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ArrowRight } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import baseURL from '../config/axiosPortConfig';

const VerifyResetPassword = () => {
    const [otp, setOTP] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('resetEmail');

    const resendOTP = useCallback(async (e) => {
        e.preventDefault();
        if(!email) {
            toast.error('Email information missing');
            navigate('/emailCheck');
            return;
        }

        try {
            const sendOTPResponse = await axios.post(`${baseURL}/auth/sendOTP`, { 
                email: email 
            });
            
            if(sendOTPResponse.status === 200) {
                toast.success('New verification code sent to your email');
            } else {
                toast.error('Failed to send verification code');
            }
        } catch (error) {
            toast.error('Failed to send verification code');
        }
    }, [email, navigate]);

    const verifyOTP = useCallback(async (e) => {
        e.preventDefault();

        if(!otp) {
            toast.error('Verification code required');
            return;
        }

        if(!email) {
            toast.error('Email information missing');
            navigate('/emailCheck');
            return;
        }

        try {
            const verifyOTPResponse = await axios.post(`${baseURL}/auth/verifyResetOTP`, {
                otp: otp.toString(),
                email: email
            });

            if(verifyOTPResponse.data.success) {
                toast.success('Verification successful');
                // Navigate to reset password page with token

                const resetToken = Date.now().toString();
                // Wait for toast to be visible before navigating
                setTimeout(() => {
                    navigate('/resetPassword', { 
                        state: { 
                            verified: true,
                            token: resetToken
                        } 
                    });
                }, 1500);
            } else {
                toast.error('Invalid verification code');
            }
        } catch (error) {
            console.error('Verification error:', error);
            toast.error(error.response?.data?.message || 'Verification failed');
            setOTP('');
        }
    }, [otp, email, navigate]);

    // UI similar to VerifyEmail.jsx
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-indigo-800 to-purple-200">
            <ToastContainer/>
            <div className="relative w-full max-w-md p-10 overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600 rounded-full translate-x-10 translate-y-10 opacity-20"></div>
                
                {/* Header */}
                <div className="relative mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Verify Your Email</h2>
                    <p className="mt-2 text-gray-500">Enter the verification code sent to your email</p>
                </div>
                
                {/* Form */}
                <form className="relative z-10 space-y-6">
                    <div className="group">
                        <div className="flex items-center border-b-2 border-gray-300 group-focus-within:border-indigo-600 transition-colors pb-2">
                            <input
                                type="text"
                                placeholder="Enter verification code"
                                className="w-full px-3 py-2 focus:outline-none bg-transparent"
                                value={otp}
                                onChange={(e) => setOTP(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                        <button
                            type="button"
                            className="flex items-center justify-center w-full px-6 py-3 text-white transition-all bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg hover:shadow-lg hover:shadow-indigo-900/20 transform hover:-translate-y-1 test-sm"
                            onClick={resendOTP}>
                            <span>Resend Code</span>
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center w-full px-6 py-3 text-white transition-all bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg hover:shadow-lg hover:shadow-indigo-900/20 transform hover:-translate-y-1"
                            onClick={verifyOTP}>
                            <span>Verify</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default memo(VerifyResetPassword);