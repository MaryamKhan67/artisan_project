import { Helmet } from 'react-helmet-async';
import { CartView } from 'src/sections/user/cart';

export default function CartPage() {
  return (
    <>
      <Helmet>
        <title> Cart | Art Gallery </title>
      </Helmet>

      <CartView />
    </>
  );
}
