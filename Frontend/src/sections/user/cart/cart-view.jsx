import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { CircularProgress, Button, Grid, Card, CardMedia, CardContent, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserHeader from 'src/layouts/home/user-header';
import Iconify from 'src/components/iconify';
import axios from 'axios';

export default function CartView() {
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');
  if (!userID) {
    navigate("/login");
  }

  const [cartProducts, setCartProducts] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCartProducts() {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/cart/get-cart-items/${userID}`);
        const { data } = response;
        setCartProducts(data.cartItems);
        setTotalAmount(data.totalAmount);
      } catch (error) {
        console.error('Error fetching cart products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCartProducts();
  }, [userID]);

  const handleRemoveProduct = async (productID) => {
    try {
      await axios.delete(`http://localhost:8080/api/user/cart/remove-item/${userID}/${productID}`);
      const response = await axios.get(`http://localhost:8080/api/user/cart/get-cart-items/${userID}`);
      const { data } = response;
      setCartProducts(data.cartItems);
      setTotalAmount(data.totalAmount);

      toast.success("Product removed from cart");
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error("Failed to remove product");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout")
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

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <Container>
        <UserHeader />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="80vh"
          textAlign="center"
        >
          <Iconify icon="mdi:cart-off" width={100} height={100} style={{ color: '#ccc' }} />
          <Typography variant="h4" mt={3} marginBottom={1}>Your Cart is Empty</Typography>
          <Typography variant="body1" marginBottom={3}>
            Looks like you haven’t added anything to your cart yet.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>
            Add Products to Checkout
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Container>

        <UserHeader />

        <Typography variant="h4" marginBottom={3}>Your Cart</Typography>

        <Grid container spacing={3}>
          {cartProducts.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.productID._id} sx={{ position: 'relative' }}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  sx={{ objectFit: "cover" }}
                  image={item.productID.images[0]}
                  alt={item.productID.productName}
                />
                <CardContent>
                  <Typography variant="h6">{item.productID.productName}</Typography>
                  <Typography variant="body1">₹{item.productID.price}</Typography>
                </CardContent>
              </Card>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: -12,
                  backgroundColor: 'red',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'darkred',
                  },
                  width: 40,
                  height: 40,
                }}
                onClick={() => handleRemoveProduct(item.productID._id)}
              >
                <Iconify icon="mdi:close" width={20} height={20} />
              </IconButton>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" marginTop={4} gutterBottom>Total Amount: ₹{totalAmount}</Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          style={{ marginTop: 4 }}
        >
          Proceed to Checkout
        </Button>
      </Container>
    </div>
  );
}
