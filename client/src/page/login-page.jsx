import React from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

import '../style/CustomLogin.css'


const LoginPage = () => {

  const { isLogin } = useAuth();
  console.log(isLogin)

  return (
    <>
      {isLogin ? (
        <Navigate to="/" />
      ) : (     
        <div>
          <div className="container-login">
            <div className="left-column-login">
              <div className="left-column-login-detail">
              </div>             
            </div>
            <div className="right-column-login">
              <h2>เข้าสู่ระบบ</h2>
              <AuthForm type="login" />
              <a href="/Register" style={{color:'black',marginTop:'5px',fontSize:'14px'}}>ไม่มีบัญชีใช่หรือไม่</a>  
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;


