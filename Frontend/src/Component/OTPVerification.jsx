// import { useState,  } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaDumbbell, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';

const OTPVerification = ({
  email,
  otp,
  setOtp,
  onClose,
  onSuccess,
  otpTimer,
  // setOtpTimer,
  canResendOTP,
  // setCanResendOTP,
  isVerifying,
  setIsVerifying,
  isSendingOTP,
  // setIsSendingOTP,
  onResendOTP
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOTPChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setIsVerifying(true);

    try {
      const verifyResponse = await axios.post(
        '/api/v1/user/verify-otp',
        { email, otp: otpValue },
        { withCredentials: true }
      );

      if (!verifyResponse.data.success) {
        throw new Error(verifyResponse.data.message || 'OTP verification failed');
      }

      toast.success('OTP verified successfully!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in relative border border-orange-400/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-500 flex items-center">
            <FaDumbbell className="mr-2" /> Verify Your Email
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-300 mb-2">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-medium text-white">{email}</p>
          <p className="text-sm text-gray-400 mt-2">
            {otpTimer > 0 ? (
              `Code expires in ${formatTime(otpTimer)}`
            ) : (
              <span className="text-orange-400">Code expired</span>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-3 mb-8">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-2xl text-center bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                value={otp[index]}
                onChange={(e) => handleOTPChange(e, index)}
                onKeyDown={(e) => handleOTPKeyDown(e, index)}
                pattern="\d*"
                inputMode="numeric"
              />
            ))}
          </div>

          <button
            type="submit"
            className={`w-full ${
              otp.join('').length === 6 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-gray-600 cursor-not-allowed'
            } text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center`}
            disabled={otp.join('').length !== 6 || isVerifying}
          >
            {isVerifying ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Verifying...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" /> Verify & Register
              </>
            )}
          </button>

          <div className="mt-4 text-center text-gray-400">
            Didn't receive code?{' '}
            <button
              type="button"
              onClick={onResendOTP}
              className={`font-medium ${
                canResendOTP 
                  ? 'text-orange-400 hover:text-orange-300' 
                  : 'text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canResendOTP || isSendingOTP}
            >
              {isSendingOTP ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;