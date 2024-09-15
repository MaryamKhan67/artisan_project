import { Helmet } from 'react-helmet-async';

import { ProductView } from 'src/sections/artist/products/view';

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Arts | Art Gallery </title>
      </Helmet>

      <ProductView />
    </>
  );
}
