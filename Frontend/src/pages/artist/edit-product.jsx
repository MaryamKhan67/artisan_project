import { Helmet } from 'react-helmet-async';
import { EditProductView } from 'src/sections/artist/products/edit-product';

export default function EditProductPage() {
  return (
    <>
      <Helmet>
        <title> Edit Product | Art Gallery </title>
      </Helmet>

      <EditProductView />
    </>
  );
}
