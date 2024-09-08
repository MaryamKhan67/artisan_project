import { Helmet } from 'react-helmet-async';
import { HomeView } from 'src/sections/user/home/view';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> Home | Art Gallery </title>
      </Helmet>

      <HomeView />
    </>
  );
}
