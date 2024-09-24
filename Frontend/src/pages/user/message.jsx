import { Helmet } from 'react-helmet-async';
import { UserMessageView } from 'src/sections/user/messages';


export default function MessagePage() {
  return (
    <>
      <Helmet>
        <title> Messages | Art Gallery </title>
      </Helmet>

      <UserMessageView />
    </>
  );
}
