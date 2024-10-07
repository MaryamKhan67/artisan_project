import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Box, Button, CircularProgress, Rating } from '@mui/material'; // Import Rating component
import axios from 'axios';
import UserHeader from 'src/layouts/home/user-header';
import Iconify from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';

export default function ArtistProfileView() {
  const { artisticName } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);  // State for reviews
  const [loading, setLoading] = useState(true);
  const [startingConvo, setStartingConvo] = useState(false);

  useEffect(() => {
    async function fetchArtistAndProducts() {
      try {
        const artistResponse = await axios.get(`http://localhost:8000/api/artist/store/get-artist-by-username/${artisticName}`);
        console.log(artistResponse);
        setArtist(artistResponse.data.artistData);
        setProducts(artistResponse.data.products);
        setReviews(artistResponse.data.reviews);  // Set reviews data
      } catch (error) {
        console.error('Error fetching artist or products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArtistAndProducts();
  }, [artisticName]);

  const handleStartConversation = (artistID) => {
    setStartingConvo(true)
    try {
      const userID = localStorage.getItem("userID")
      axios.get(`http://localhost:8000/api/artist/messages/${userID}/${artistID}`)
        .then(response => {
          if (response.data.messages.length === 0) {
            axios.post(`http://localhost:8000/api/artist/messages/send-message`, {
              userID,
              artistID,
              message: 'Hello!',
              sender: userID
            }).then(() => {
              navigate(`/messages`);
            }).catch(error => {
              console.error('Error creating initial message', error);
            });
          } else {
            navigate(`/messages`);
          }
        }).catch(error => {
          console.error('Error checking conversation', error);
        });
    } catch (e) {
      console.log(e)
    } finally {
      setStartingConvo(false)
    }
  };


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

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Container>

        <UserHeader />

        <Card sx={{ boxShadow: 3, mb: 4 }}>
          <CardMedia
            component="img"
            height="200"
            image={artist.banner || '/assets/background/overlay_3.jpg'}
            alt={`${artist.artisticName}'s Banner`}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2}>
                <CardMedia
                  component="img"
                  image={artist.logo || '/favicon/favicon.png'}
                  alt={`${artist.artisticName}'s Logo`}
                  sx={{ borderRadius: '50%', width: 150, height: 150, mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h5" mt={1}>{artist.artisticName}</Typography>
                <Typography variant="body1" color="textSecondary">{artist.category}</Typography>
                <Typography variant="body2" mt={1}>{artist.description || 'No description available.'}</Typography>

                {averageRating ? (
                  <Box mt={1} display="flex" alignItems="center">
                    <Rating value={Number(averageRating)} readOnly precision={0.1} />
                    <Typography variant="body2" ml={1}>({averageRating})</Typography>
                    <Typography variant="caption" ml={1}>Based on {reviews.length} reviews</Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" mt={2}>No ratings available</Typography>
                )}

                <LoadingButton
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  loading={startingConvo}
                  startIcon={<Iconify icon="mdi:message" />}
                  onClick={() => handleStartConversation(artist._id)}
                >
                  Message
                </LoadingButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Typography variant="h4" gutterBottom>Arts</Typography>
        <Grid container spacing={3} mb={4}>
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={3} md={3} key={product._id}>
                <Link to={`/view-product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
    </div>
  );
}
