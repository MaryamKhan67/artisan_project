
import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';
import ArtistCard from '../artist-card';
import ArtCard from '../art-card';
import ArtistSearch from '../artist-search';
import CategorySort from '../category-sort';

// ----------------------------------------------------------------------

export default function HomeView() {
  const [artists, setArtists] = useState([]);
  const [arts, setArts] = useState([]);

  const [filteredArtists, setFilteredArtists] = useState([]);
  const [filteredArts, setFilteredArts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchArtists() {
      try {
        const response = await fetch('http://localhost:8080/api/user/home/get-data');
        const data = await response.json();
        setArtists(data.artists);
        setFilteredArtists(data.artists);
        setArts(data.arts)
        setFilteredArts(data.arts)
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    }
    fetchArtists();
  }, []);

  const handleCategorySort = (category) => {
    setSelectedCategory(category)
    if (category === "Select Category") {
      setFilteredArtists(artists);
      setFilteredArtists(arts)
    } else {
      setFilteredArtists(artists.filter((artist) => artist.category === category));
      setFilteredArts(arts.filter((art) => art.artistID[0].category === category));
    }
  };

  const userID = localStorage.getItem('userID');
  const handleLoginLogout = () => {
    if (userID) {
      localStorage.removeItem('userID');
      navigate('/logout');
    } else {
      navigate('/login');
    }
  };


  return (
    <Container >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={5}>
        <Typography variant="h4">
          Art Gallery <Logo />
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon={userID ? 'eva:log-out-outline' : 'eva:log-in-outline'} />}
          onClick={handleLoginLogout}
        >
          {userID ? 'Logout' : 'Login'}
        </Button>
      </Stack>

      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <ArtistSearch artists={filteredArtists} />
        <CategorySort
          categories={["Painter", "Calligraphers", "Tattooists", "Sculptors", "Illustrators", "Sketch Artist", "Graphic Designers"]}
          onSort={handleCategorySort}
          selectedCategory={selectedCategory}
        />
      </Stack>

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Artists
      </Typography>
      <Grid container spacing={3}>
        {filteredArtists.map((artist, index) => (
          <ArtistCard key={index} artist={artist} index={index} />
        ))}
      </Grid>

      <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
        Arts
      </Typography>
      <Grid container spacing={3}>
        {filteredArts.map((art, index) => (
          <ArtCard key={index} art={art} index={index} />
        ))}
      </Grid>


    </Container >
  );
}
