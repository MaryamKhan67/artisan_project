import { Helmet } from 'react-helmet-async';

import { OrderSuccessView } from 'src/sections/user/order/success';

export default function OrderSuccessPage() {
  return (
    <>
      <Helmet>
        <title> Checkout | Art Gallery </title>
      </Helmet>

      <OrderSuccessView />
    </>
  );
}
