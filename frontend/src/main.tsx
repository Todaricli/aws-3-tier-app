import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx'
import './index.css'
import ErrorPage from './ErrorPage.tsx';
import BooksPage from './BooksPage.tsx';
import AuthorsPage from './AuthorsPage.tsx';
import Az from './Az.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/books",
    element: <BooksPage />
  },
  {
    path: "/authors",
    element: <AuthorsPage />
  },
  {
    path: "/az",
    element: <Az />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
