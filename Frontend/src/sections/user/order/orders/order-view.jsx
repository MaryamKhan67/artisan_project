import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { CircularProgress, Button, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserHeader from 'src/layouts/home/user-header';
import Iconify from 'src/components/iconify';
import axios from 'axios';

export default function OrdersView() {
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');
  if (!userID) {
    navigate("/login");
  }

  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/orders/get-orders/${userID}`);
        const { data } = response;
        setOrders(data);
      } catch (error) {
        console.error('Error fetching cart products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [userID]);

  const handleMoreDetailsClick = (orderID) => {
    navigate(`/order-detail/${orderID}`)
  }

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

  if (!orders || orders.length === 0) {
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
          <Typography variant="h4" mt={3} marginBottom={1}>No Orders Found</Typography>
          <Typography variant="body1" marginBottom={3}>
            You have not placed any orders yet.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Container>

        <UserHeader />

        <Typography variant="h4" marginBottom={3}>Your Orders</Typography>

        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order._id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Order #{order.orderID}</Typography>
                    <Typography variant="subtitle1" color={order.status === 'Delivered' ? 'green' : 'orange'}>
                      {order.status}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    {order.product.map((p, index) => (
                      <Box key={index} display="flex" mb={1} alignItems="center">
                        <CardMedia
                          component="img"
                          height="50"
                          image={p.images[0] || '/default-product-image.jpg'}
                          alt={p.productName}
                          sx={{ borderRadius: '50%', width: 80, height: 80, mr: 2 }}

                        />
                        <Box>
                          <Typography variant="body1">
                            {p.productName}
                          </Typography>
                          <Typography variant="h6">
                            ₹{p.price}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="textSecondary">
                      Order Date: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button variant="text" color="primary" size="small" onClick={() => handleMoreDetailsClick(order._id)}>
                      More Details
                    </Button>
                  </Box>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Container>
    </div>
  );
}
