import { createBrowserRouter } from 'react-router-dom';

import App from '../App';

import { HomePage } from '../pages/Home/HomePage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';

import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { ProblemExplorerPage } from '../pages/ProblemExplorer/ProblemExplorerPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },

      /* Protected Routes for authenticated users */
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'problems',
            element: <ProblemExplorerPage />,
          },
          /* Submission, Leaderboard, etc. */
        ],
      },
    ],
  },
]);
