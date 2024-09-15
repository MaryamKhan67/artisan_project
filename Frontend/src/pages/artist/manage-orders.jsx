import { Helmet } from 'react-helmet-async';

import { ManageOrdersView } from 'src/sections/artist/orders/view';

export default function ManageOrdersPage() {
  return (
    <>
      <Helmet>
        <title> Manage Orders | Art Gallery </title>
      </Helmet>

      <ManageOrdersView />
    </>
  );
}
