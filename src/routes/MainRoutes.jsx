import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import { Navigate, useLocation } from 'react-router';
import MembersPage from '../pages/extra-pages/members';
import TicketsPage from '../pages/extra-pages/tickets';
import BuildingsPage from '../pages/extra-pages/buildings';

// 👇 Define RequireAuth inline
const RequireAuth = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <RequireAuth> {/* 👈 wrap */}
      <DashboardLayout />
    </RequireAuth>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'members',
      element: <MembersPage />
    },
    {
      path: "tickets",
      element: <TicketsPage />
    },
    {
      path: '/buildings',
      element: <BuildingsPage />
    }
  ]
};

export default MainRoutes;
