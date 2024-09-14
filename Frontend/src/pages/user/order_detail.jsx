import { Helmet } from 'react-helmet-async';

import { OrderDetailView } from 'src/sections/user/order/detail';

export default function OrderDetailPage() {
  return (
    <>
      <Helmet>
        <title> Order Detail | Art Gallery </title>
      </Helmet>

      <OrderDetailView />
    </>
  );
}
