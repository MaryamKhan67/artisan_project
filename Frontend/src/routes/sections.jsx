import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import ManageStorePage from 'src/pages/manage-store';

export const IndexPage = lazy(() => import('src/pages/app'));
// export const BlogPage = lazy(() => import('src/pages/blog'));

export const ProductsPage = lazy(() => import('src/pages/products'));
export const AddProductPage = lazy(() => import('src/pages/add-product'));
export const EditProductPage = lazy(() => import('src/pages/edit-product'));

export const LoginPage = lazy(() => import('src/pages/login'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        // Add index: true to main /
        { path: 'dashboard', element: <IndexPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'add-product', element: <AddProductPage /> },
        { path: 'edit-product/:id', element: <EditProductPage /> },
        { path: 'manage-store', element: <ManageStorePage /> },
        // { path: 'messages', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
