
import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

import UserHeader from 'src/layouts/home/user-header';

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
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("Select Category");

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
      } finally {
        setLoading(false)
      }
    }
    fetchArtists();
  }, []);

  const handleCategorySort = (category) => {
    setSelectedCategory(category)
    if (category === "Select Category") {
      setFilteredArtists(artists);
      setFilteredArts(arts)
    } else {
      setFilteredArtists(artists.filter((artist) => artist.category === category));
      setFilteredArts(arts.filter((art) => art.artistID.category === category));
    }
  };


  return (
    <Container >

      <UserHeader />


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
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredArtists.map((artist, index) => (
            <ArtistCard key={index} artist={artist} index={index} />
          ))}
        </Grid>
      )}

      <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
        Arts
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredArts.map((art, index) => (
            <ArtCard key={index} art={art} index={index} />
          ))}
        </Grid>
      )}

    </Container >
  );
}
