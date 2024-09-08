import { Helmet } from 'react-helmet-async';

import { UserLoginView } from 'src/sections/user/login';

export default function UserLoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | Art Gallery </title>
      </Helmet>

      <UserLoginView />
    </>
  );
}
