import { Helmet } from 'react-helmet-async';

import { ManageStoreView } from 'src/sections/artist/store';

export default function ManageStorePage() {
  return (
    <>
      <Helmet>
        <title> Manage Store | Art Gallery </title>
      </Helmet>

      <ManageStoreView />
    </>
  );
}
