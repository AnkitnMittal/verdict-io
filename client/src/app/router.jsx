import { createBrowserRouter } from 'react-router-dom';

import App from '../App';

import { HomePage } from '../pages/Home/HomePage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { ProblemExplorerPage } from '../pages/ProblemExplorer/ProblemExplorerPage';

import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { ProblemManagerPage } from '../pages/Admin/ProblemManagerPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },

      /* Protected Routes for authenticated users */
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'problems', element: <ProblemExplorerPage /> },
          {
            element: <ProtectedRoute allowedRoles={['admin']} />,
            children: [
              {
                path: 'admin/problems/new',
                element: <ProblemManagerPage />,
              },
            ],
          },
          /* Additional protected routes for authenticated users can be added here
          Submission, Leaderboard, etc. */
        ],
      },
    ],
  },
]);
