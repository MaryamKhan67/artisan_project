import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import OrderSuccessPage from 'src/pages/user/order_success';
import OrdersPage from 'src/pages/user/orders';

export const IndexPage = lazy(() => import('src/pages/artist/app'));
export const ProductsPage = lazy(() => import('src/pages/artist/products'));
export const ManageStorePage = lazy(() => import('src/pages/artist/manage-store'));
export const AddProductPage = lazy(() => import('src/pages/artist/add-product'));
export const EditProductPage = lazy(() => import('src/pages/artist/edit-product'));
export const ArtistLoginPage = lazy(() => import('src/pages/artist/login'));
export const ArtistRegisterPage = lazy(() => import('src/pages/artist/register'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export const UserLoginPage = lazy(() => import('src/pages/user/login'));
export const UserRegisterPage = lazy(() => import('src/pages/user/register'));
export const HomePage = lazy(() => import('src/pages/user/home'));
export const ProductPage = lazy(() => import('src/pages/user/product'));
export const WishlistPage = lazy(() => import('src/pages/user/wishlist'));
export const CheckoutPage = lazy(() => import('src/pages/user/checkout'));
export const CartPage = lazy(() => import('src/pages/user/cart'));

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
        { path: 'artist/dashboard', element: <IndexPage /> },
        { path: 'artist/products', element: <ProductsPage /> },
        { path: 'artist/add-product', element: <AddProductPage /> },
        { path: 'artist/edit-product/:id', element: <EditProductPage /> },
        { path: 'artist/manage-store', element: <ManageStorePage /> },
      ],
    },
    {
      path: 'artist/login',
      element: <ArtistLoginPage />,
    },
    {
      path: 'artist/register',
      element: <ArtistRegisterPage />,
    },
    {
      path: 'login',
      element: <UserLoginPage />,
    },
    {
      path: 'register',
      element: <UserRegisterPage />,
    },
    {
      path: '',
      element: <HomePage />,
    },
    {
      path: '/view-product/:id',
      element: <ProductPage />
    },
    {
      path: '/cart',
      element: <CartPage />
    },
    {
      path: '/wishlist',
      element: <WishlistPage />
    },
    {
      path: '/checkout',
      element: <CheckoutPage />
    },
    {
      path: '/order-success',
      element: <OrderSuccessPage />
    },
    {
      path: '/orders',
      element: <OrdersPage />
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
