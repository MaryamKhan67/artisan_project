import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';
import axios from "axios";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, CircularProgress, Rating } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import UserHeader from 'src/layouts/home/user-header';
import ArtCard from '../home/art-card';

// ----------------------------------------------------------------------

const ImageContainer = ({ children }) => (
  <div style={{ position: 'relative', height: '500px', width: '100%' }}>
    {children}
  </div>
);

const ProductImages = ({ children }) => (
  <div style={{ position: 'relative', height: '100%', width: '100%' }}>
    {children}
  </div>
);

const Image = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      maxWidth: '100%',
      maxHeight: '100%',
    }}
  />
);

const PrevButton = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      left: 10,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
      transform: 'translateY(-50%)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    }}
  >
    <Iconify icon="eva:arrow-back-fill" width={24} height={24} />
  </IconButton>
);

const NextButton = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      right: 10,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
      transform: 'translateY(-50%)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    }}
  >
    <Iconify icon="eva:arrow-forward-fill" width={24} height={24} />
  </IconButton>
);

const ThumbnailContainer = ({ children }) => <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>{children}</div>;
const Thumbnail = ({ src, alt, onClick, active }) => (
  <img
    src={src}
    alt={alt}
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
    role='button'
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick();
      }
    }}
    style={{
      width: 60,
      height: 70,
      cursor: 'pointer',
      border: active ? '2px solid blue' : '2px solid transparent',
      marginRight: 8,
    }}
  />
);

Thumbnail.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
};

ImageContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

ProductImages.propTypes = {
  children: PropTypes.node.isRequired,
};

ThumbnailContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

PrevButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

NextButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState(null);
  const [artist, setArtist] = useState(null);
  const [averageMetrics, setAverageMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? product.images.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === product.images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`http://localhost:8000/api/user/product/get-product-by-id/${id}`);
        const data = await response.json();
        setProduct(data.product);
        setArtist(data.product.artistID);
        setProducts(data.products)
        setAverageMetrics(data.averageMetrics)
      } catch (error) {
        console.error('Error fetching product or artist:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const userID = localStorage.getItem('userID');

  const handleCartClick = async () => {
    if (!userID) {
      navigate("/login")
    } else {
      try {
        const response = await axios.post("http://localhost:8000/api/user/cart/add-to-cart", {
          userID,
          productID: id,
        });

        if (response.status === 200) {
          toast.success(response.data);
        } else {
          console.error("Failed to add product to cart");
          toast.warning("Could not add product to Cart. Please try again.");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleWishlistClick = async () => {
    if (!userID) {
      navigate("/login")
    } else {
      try {
        const response = await axios.post("http://localhost:8000/api/user/wishlist/add-to-wishlist", {
          userID,
          productID: id,
        });

        if (response.status === 200) {
          toast.success(response.data);
        } else {
          console.error("Failed to add product to wishlist");
          toast.warning("Could not add product to wishlist. Please try again.");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Something went wrong. Please try again.");
      }
    }
  };


  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product || !artist) {
    return <Typography variant="h6">Product or Artist not found</Typography>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Container>

        <UserHeader />

        <Grid container spacing={3} style={{ flexGrow: 1, backgroundColor: 'white', marginTop: 8, paddingBottom: 82 }}>
          <Grid item xs={12} md={6}>
            <ImageContainer>
              <ProductImages>
                <Image src={product.images[currentIndex]} alt={`Product Image ${currentIndex + 1}`} />
                <PrevButton onClick={handlePrevClick} />
                <NextButton onClick={handleNextClick} />
              </ProductImages>
              <ThumbnailContainer>
                {product.images.map((imageURL, index) => (
                  <Thumbnail
                    key={index}
                    src={imageURL}
                    alt={`Thumbnail ${index + 1}`}
                    active={index === currentIndex}
                    onClick={() => handleThumbnailClick(index)}
                  />
                ))}
              </ThumbnailContainer>
            </ImageContainer>
          </Grid>

          <Grid xs={12} md={6}>
            <Stack spacing={2}>

              <Typography variant="h4">{product.productName}</Typography>
              <Typography variant="body1" color="text.secondary">
                {product.description}
              </Typography>
              <Typography variant="h5">Price: ₹{product.price}</Typography>
              <Typography variant="body1">In Stock: {product.stockQuantity}</Typography>


              <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/view-artist/${artist.artisticName}`}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CardMedia
                    component="img"
                    image={artist.logo || "/favicon/favicon.png"}
                    alt={artist.artisticName}
                    sx={{ width: 80, height: 80, borderRadius: '50%' }}
                  />
                  <div>
                    <Typography variant="h6">Artist: {artist.artisticName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {artist.category}
                    </Typography>
                  </div>
                </Stack>
              </Link>

              {product.stockQuantity > 0 ? (
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="primary" onClick={handleCartClick} size="large" startIcon={<Iconify icon="eva:shopping-cart-outline" />}>
                    Add to Cart
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleWishlistClick} size="large" startIcon={<Iconify icon="eva:heart-outline" />}>
                    Add to Wishlist
                  </Button>
                </Stack>
              ) : (
                <Typography variant="h6" color="error" mt={2}>
                  Out of Stock
                </Typography>
              )}

              {averageMetrics && (
                <div style={{ marginBottom: '1rem' }}>

                  {/* Overall Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Rating
                      name="overall-rating"
                      value={averageMetrics.overallRating}
                      precision={0.1}
                      readOnly
                      size='large'
                    />
                    <Typography style={{ marginLeft: '0.5rem' }}>{averageMetrics.overallRating.toFixed(1)}</Typography>
                  </div>

                  {/* Art Quality Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Typography component="legend" style={{ marginRight: '0.5rem' }}>Art Quality:</Typography>
                    <Rating
                      name="art-quality-rating"
                      value={averageMetrics.artQuality}
                      precision={0.1}
                      readOnly
                    />
                    <Typography style={{ marginLeft: '0.5rem' }}>{averageMetrics.artQuality.toFixed(1)}</Typography>
                  </div>

                  {/* Creativity Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Typography component="legend" style={{ marginRight: '0.5rem' }}>Creativity:</Typography>
                    <Rating
                      name="creativity-rating"
                      value={averageMetrics.creativity}
                      precision={0.1}
                      readOnly
                    />
                    <Typography style={{ marginLeft: '0.5rem' }}>{averageMetrics.creativity.toFixed(1)}</Typography>
                  </div>

                  {/* Communication Rating */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="legend" style={{ marginRight: '0.5rem' }}>Communication:</Typography>
                    <Rating
                      name="communication-rating"
                      value={averageMetrics.communication}
                      precision={0.1}
                      readOnly
                    />
                    <Typography style={{ marginLeft: '0.5rem' }}>{averageMetrics.communication.toFixed(1)}</Typography>
                  </div>
                </div>

              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Container>
        <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
          More Arts from {artist.artisticName}
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {products.map((art, index) => (
              <ArtCard key={index} art={art} index={index} />
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
}
