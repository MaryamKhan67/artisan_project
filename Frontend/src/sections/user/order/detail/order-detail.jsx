import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Box, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import UserHeader from 'src/layouts/home/user-header';
import Iconify from 'src/components/iconify';

export default function OrderDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');

  if (!userID) {
    navigate("/login");
  }

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/orders/get-order-by-id/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [id]);

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

  if (!order) {
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
          <Typography variant="h4" mt={3} marginBottom={1}>Order Not Found</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/orders')}>
            Go Back to Orders
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Container>
        <UserHeader />

        <Typography variant="h4" marginBottom={3}>Order Details</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Order #{order.orderID}</Typography>
                  <Typography variant="subtitle1" color={order.status === 'Delivered' ? 'green' : 'orange'}>
                    {order.status}
                  </Typography>
                </Box>

                <Box mt={2} mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {order.product.map((p, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card elevation={8}>
                        <CardMedia
                          component="img"
                          height="300"
                          sx={{ objectFit: "cover" }}
                          image={p.images[0]}
                          alt={p.productName}
                        />
                        <CardContent>
                          <Typography variant="h6">{p.productName}</Typography>
                          <Typography variant="body1">₹{p.price}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box mt={2} mb={2}>
                      <Typography variant="body2">
                        <strong>Shipping Address:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingAddress.flatNo}, {order.shippingAddress.streetAddress}
                      </Typography>
                      {order.shippingAddress.landmark && (
                        <Typography variant="body2">{order.shippingAddress.landmark}</Typography>
                      )}
                      <Typography variant="body2">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </Typography>
                      <Typography variant="body2">Mobile: {order.shippingAddress.mobile}</Typography>
                      <Typography variant="body2">Email: {order.shippingAddress.email}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box mt={2} mb={2}>

                      <Typography variant="body2">
                        <strong>Payment ID:</strong> {order.shippingAddress.raz_paymentID || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Razorpay Order ID:</strong> {order.shippingAddress.raz_orderID || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Payment Status:</strong> Completed
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </div>
  );
}
