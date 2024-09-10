import { Helmet } from 'react-helmet-async';
import { WishlistView } from 'src/sections/user/wishlist';

export default function WishlistPage() {
  return (
    <>
      <Helmet>
        <title> Wishlist | Art Gallery </title>
      </Helmet>

      <WishlistView />
    </>
  );
}
