import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './store';
import { router } from './router';

/* Wrapper component to provide Redux store and React Router */
export const AppProviders = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};
