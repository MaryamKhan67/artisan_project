import { Helmet } from 'react-helmet-async';
import { ProductView } from 'src/sections/user/product';

export default function ProductPage() {
  return (
    <>
      <Helmet>
        <title> Product | Art Gallery </title>
      </Helmet>

      <ProductView />
    </>
  );
}
