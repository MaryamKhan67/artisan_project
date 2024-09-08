import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/sections/artist/login';

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Artist Login | Art Gallery </title>
      </Helmet>

      <LoginView />
    </>
  );
}
