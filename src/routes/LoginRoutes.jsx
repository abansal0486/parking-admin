import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import { Navigate } from 'react-router';


// 👇 Define RedirectIfAuth inline
const RedirectIfAuth = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      children: [
        {
          path: '/login',
          element: (
            <RedirectIfAuth> {/* 👈 wrap */}
              <LoginPage />
            </RedirectIfAuth>
          )
        },
        // {
        //   path: '/register',
        //   element: <RegisterPage />
        // }
      ]
    }
  ]
};

export default LoginRoutes;
