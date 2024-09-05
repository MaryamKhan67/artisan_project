import { Helmet } from 'react-helmet-async';

import { ProductView } from 'src/sections/products/view';

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Products | Art Gallery </title>
      </Helmet>

      <ProductView />
    </>
  );
}
