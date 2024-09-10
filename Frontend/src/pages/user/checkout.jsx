import { Helmet } from 'react-helmet-async';

import { CheckoutView } from 'src/sections/user/checkout';

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Checkout | Art Gallery </title>
      </Helmet>

      <CheckoutView />
    </>
  );
}
