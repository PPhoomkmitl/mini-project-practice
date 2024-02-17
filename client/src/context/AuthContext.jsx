import React, { createContext, useContext, useState , useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
  const [ user, setUser] = useState([{}])
  const [ isLogin, setIsLogin] = useState(false)
  const [ isRegister, setIsRegister] = useState(false)

  const refreshToken = localStorage.getItem('refresh_token')
  const accessToken = localStorage.getItem('access_token')


  const checkLoginStatus = async () => {
    try {
      // console.log(accessToken)
      // console.log(refreshToken)
      // console.log(isLogin)
      if(accessToken === null && refreshToken === null){
        throw(error)
      }
      const response = await axios.get('http://localhost:5000/auth/check-login' , 
      {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
      }
      )
      console.log('success1')
      console.log(response)
      console.log(response.data)
      // console.log(response.data.user[0].user_name)
      if (response.data.isLogin && response !== null) {
        setIsLogin(response.data.isLogin);
        setUser(response.data.user[0])  
      }
      else{
        setIsLogin(false)
        setUser(null)
      }
    } 
    catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Token expired')
        localStorage.removeItem('access_token');
        await refreshTokens()
        const newAccessToken = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:5000/auth/check-login' , {
        headers: {
            Authorization: `Bearer ${newAccessToken}`,
        },
      })
      console.log('success2')
      console.log('renew-token')
      const data = response.data;
      if(response !== null){
        if (data.isLogin) {
          setIsLogin(true);
          setUser(data.user[0])  
        }
      }  
      } else {
        setIsLogin(false);
        setUser(null)
        console.log('No Token')
      }
    }
  }
  
  const refreshTokens = async () => {
    try {
      console.log(localStorage.getItem('refresh_token'))
      const response = await axios.post('http://localhost:5000/auth/refresh',  
      {
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      })
      localStorage.removeItemItem('refresh_token')
      console.log('accessToken Success',response.data.accessToken)
      localStorage.setItem('access_token', response.data.accessToken)
      localStorage.setItem('refresh_token', response.data.refreshToken)
    } catch (error) {
      console.warn('Cannot refreshing tokens:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser , isLogin, setIsLogin  ,refreshTokens  , checkLoginStatus , isRegister , setIsRegister}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)
};
