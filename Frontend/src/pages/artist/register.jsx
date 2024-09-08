import { Helmet } from 'react-helmet-async';

import { RegisterView } from 'src/sections/artist/register';

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Artist Register | Art Gallery </title>
      </Helmet>

      <RegisterView />
    </>
  );
}
