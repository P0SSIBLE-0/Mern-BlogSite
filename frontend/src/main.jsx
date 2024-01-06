import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx';
import Blog from './pages/Blogs.jsx';
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { UserContextProvider } from './userContext/UserContext.jsx';
import CreatePost from './pages/CreatePost.jsx';
import PostPage from './pages/PostPage.jsx';
import EditPage from './pages/EditPage.jsx';
import Loader from './components/Loader.jsx'
import NotFound from './pages/NotFound.jsx';



const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
    errorElement: <NotFound/>,
    children: [
      {
        path: '',
        element: <Blog/>,
        errorElement: <NotFound/>,
      },
      {
        path: '/login',
        element: <Login/>,
        errorElement: <NotFound/>,
      },
      {
        path: '/signup',
        element: <Signup/>,
        errorElement: <NotFound/>,
      },
      {
        path: '/create',
        element: <CreatePost/>,
        errorElement: <NotFound/>,
      },
      {
        path: '/post/:id',
        element: <PostPage/>,
        errorElement: <NotFound/>,
      },
      {
        path: '/edit/:id',
        element: <EditPage/>,
        errorElement: <NotFound/>,
      },

    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
    <RouterProvider router={router} />
    </UserContextProvider>
  </React.StrictMode>,
)
