import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Box, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import UserHeader from 'src/layouts/home/user-header';
import Iconify from 'src/components/iconify';

export default function ArtistProfileView() {
  const { artisticName } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtistAndProducts() {
      try {
        console.log(artisticName)
        // Fetch the artist's details
        const artistResponse = await axios.get(`http://localhost:8080/api/artist/store/get-artist-by-username/${artisticName}`);
        console.log(artistResponse)
        setArtist(artistResponse.data.artistData[0]);
        setProducts(artistResponse.data.products);
      } catch (error) {
        console.error('Error fetching artist or products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArtistAndProducts();
  }, [artisticName]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!artist) {
    return (
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80vh" textAlign="center">
          <Typography variant="h4" mt={3} marginBottom={1}>Artist Not Found</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>
            Go Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Container>

        <UserHeader />

        <Card sx={{ boxShadow: 3, mb: 4 }}>
          <CardMedia
            component="img"
            height="200"
            image={artist.banner || '/default-banner.jpg'}
            alt={`${artist.artisticName}'s Banner`}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2}>
                <CardMedia
                  component="img"
                  image={artist.logo || '/default-logo.png'}
                  alt={`${artist.artisticName}'s Logo`}
                  sx={{ borderRadius: '50%', width: 150, height: 150, mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h5" mt={1}>{artist.artisticName}</Typography>
                <Typography variant="body1" color="textSecondary">{artist.category}</Typography>
                <Typography variant="body2" mt={1}>{artist.description || 'No description available.'}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} startIcon={<Iconify icon="mdi:message" />}
                  onClick={() => navigate(`/message/${artisticName}`)}>
                  Message
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Typography variant="h4" gutterBottom>Arts</Typography>
        <Grid container spacing={3} mb={4}>
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={3} md={3} key={product._id}>
                <Link to={`/view-product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }} >
                  <Card sx={{ boxShadow: 2 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images[0] || '/favicon/favicon.png'}
                      alt={product.productName}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{product.productName}</Typography>
                      <Typography variant="body1">₹{product.price}</Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" mt={3} ml={3}>No products available for this artist.</Typography>
          )}
        </Grid>
      </Container>
    </div >
  );
}
