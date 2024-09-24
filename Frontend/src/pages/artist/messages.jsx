import { Helmet } from 'react-helmet-async';
import { ArtistMessageView } from 'src/sections/artist/messages';


export default function AdminMessagePage() {
  return (
    <>
      <Helmet>
        <title> Messages | Art Gallery </title>
      </Helmet>

      <ArtistMessageView />
    </>
  );
}
