import React, { useState } from 'react';
// import { resetPassword } from '../services/authService';
import LoginNavbar from '../components/layout/LoginNavbar';

// This Feature is in Contruction 
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const result = await resetPassword(email);
    
    if (result.success) {
      setMessage("Check your inbox! We've sent instructions to reset your password.");
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <LoginNavbar showGetStarted={false} />
      <main className="min-h-screen flex justify-center items-center px-4 sm:px-6 my-10">
        <div>
          <h3 className='text-2xl max-w-60 text-center mb-4 font-semibold'>Reset Password</h3>
          <form onSubmit={handleReset} className='flex flex-col gap-2'>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className='py-2 px-4 rounded-lg border-neutral-600 border outline-none focus:border-neutral-400 hover:border-neutral-500'
            />
            <button className='px-4 py-2 bg-yellow-400 text-black rounded-lg cursor-pointer transition ease-in font-medium hover:bg-yellow-500' type="submit">Send Reset Link</button>
          </form>
          
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </main>
    </>
  );
};

export default ForgotPassword