import React from 'react';
import AuthForm from '../components/AuthForm';
import OtpForm from '../components/OtpForm';
import { useAuth } from '../context/AuthContext';
import { Navigate} from 'react-router-dom';

const RegisterPage = () => {
  const { isRegister } = useAuth();
  return (
    <>
        <div>
          <OtpForm type="register"/>        
        </div>
        {isRegister ? (
            <Navigate to="/LogIn" />
        ) : null}
    </>
  );
};

export default RegisterPage