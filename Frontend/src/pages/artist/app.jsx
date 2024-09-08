import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/artist/view';

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Art Gallery </title>
      </Helmet>
      <AppView />
    </>
  );
}
