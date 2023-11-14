import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter , RouterProvider } from "react-router-dom";
import './index.css'

import { Helmet } from 'react-helmet';

const helmet = (
  <Helmet>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Prompt:wght@100;300;400;800&display=swap"
      rel="stylesheet"
    />
  </Helmet>
);


//pages
import ErrorPage from "./page/error-page";
import Home from "./page/home-page";
import LogIn from "./page/login-page"
import Register from './page/register-page';
import CategoryPage from './page/category-page';

//useContext
import { AuthProvider } from './context/AuthContext';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/LogIn",
    element: <LogIn />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Category/:id",
    element: <CategoryPage />,
    errorElement: <ErrorPage />,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {helmet}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
