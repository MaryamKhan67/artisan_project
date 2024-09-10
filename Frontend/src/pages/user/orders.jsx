import { Helmet } from 'react-helmet-async';

import { OrdersView } from 'src/sections/user/order/orders';

export default function OrdersPage() {
  return (
    <>
      <Helmet>
        <title> Orders | Art Gallery </title>
      </Helmet>

      <OrdersView />
    </>
  );
}
