import { Helmet } from 'react-helmet-async';

import { ArtistProfileView } from 'src/sections/user/store';

export default function ArtistProfilePage() {
  return (
    <>
      <Helmet>
        <title> Artist Profile | Art Gallery </title>
      </Helmet>

      <ArtistProfileView />
    </>
  );
}
