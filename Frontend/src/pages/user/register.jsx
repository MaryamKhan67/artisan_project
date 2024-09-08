import { Helmet } from 'react-helmet-async';

import { UserRegisterView } from 'src/sections/user/register';

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Register | Art Gallery </title>
      </Helmet>

      <UserRegisterView />
    </>
  );
}
