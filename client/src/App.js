//creating react functional component here using rfce command
import React from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'

// importing all components
import Username from './components/Username'
import Password from './components/Password'
import Register from './components/Register'
import Reset from './components/Reset'
import Recovery from './components/Recovery'
import Profile from './components/Profile'
import PageNotFound from './components/PageNotFound'





// root routes
const router = createBrowserRouter([
    {
        path : '/',
        element : <Username></Username>

    },
    {
        path : '/register',
        element : <Register></Register>

    },
    {
        path : '/password',

        element : <Password></Password>

    },
    {
        path : '/profile',
        element : <Profile></Profile>

    },
    {
        path : '/recovery',

        element : <Recovery></Recovery>

    },
    {
        path : '/reset',
        element : <Reset></Reset>

    },
    {
        path : '*',

        element : <PageNotFound></PageNotFound>

    },
])

function App() {
  return (
    <main>
        {/* specifing above mentioned router to the router property of RouterProvider */}
        <RouterProvider router={router}></RouterProvider>
    </main>
  )
}

export default App