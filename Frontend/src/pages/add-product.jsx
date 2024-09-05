import { Helmet } from 'react-helmet-async';

import { AddProductView } from 'src/sections/products/new-product';

export default function AddProductPage() {
  return (
    <>
      <Helmet>
        <title> Add Product | Art Gallery </title>
      </Helmet>

      <AddProductView />
    </>
  );
}
