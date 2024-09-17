import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Box, Button, CircularProgress, Rating, TextField, Divider } from '@mui/material';
import axios from 'axios';
import UserHeader from 'src/layouts/home/user-header';
import Iconify from 'src/components/iconify';
import { toast } from 'react-toastify';

export default function OrderDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');

  if (!userID) {
    navigate("/login");
  }

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [review, setReview] = useState({
    overallRating: 0,
    artQuality: 0,
    creativity: 0,
    communication: 0,
    comment: ''
  });

  const handleRatingChange = (metric, value) => {
    setReview(prevReview => ({
      ...prevReview,
      [metric]: value
    }));
  };

  const handleCommentChange = (e) => {
    setReview(prevReview => ({
      ...prevReview,
      comment: e.target.value
    }));
  };

  const handleSubmitReview = async () => {
    const { artQuality, creativity, communication, comment } = review;

    if (!artQuality || !creativity || !communication) {
      toast.warning('Please provide ratings for all metrics!');
      return;
    }

    try {
      const overallRating = parseFloat((parseInt(artQuality, 10) + parseInt(creativity, 10) + parseInt(communication, 10)) / 3, 10).toFixed(1);
      console.log(overallRating)
      const reviewData = {
        artistID: order.product[0].artistID,
        userID,
        orderID: order._id,
        overallRating,
        metrics: {
          artQuality,
          creativity,
          communication
        },
        comment
      };

      const response = await axios.post('http://localhost:8080/api/user/ratings/submit-rating', reviewData);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review.');
    }
  };


  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/orders/get-order-by-id/${id}`);
        setOrder(response.data);

        const ratingResponse = await axios.post('http://localhost:8080/api/user/ratings/get-order-rating', {
          artistID: response.data.product[0].artistID,
          userID,
          orderID: response.data._id
        });

        if (ratingResponse.status === 200) {
          setReview({
            overallRating: ratingResponse.data.overallRating,
            artQuality: ratingResponse.data.metrics.artQuality,
            creativity: ratingResponse.data.metrics.creativity,
            communication: ratingResponse.data.metrics.communication,
            comment: ratingResponse.data.comment
          });
        }

      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [id, userID]);

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
                  {/* Product Section */}
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      {order.product.map((p, index) => (
                        <Grid item xs={12} sm={6} key={index}>
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
                  </Grid>

                  <Grid item xs={12} md={4}>
                    {order.status === 'Delivered' && (
                      <Card sx={{ padding: 3, boxShadow: 3 }}>
                        <Typography variant="h6" marginBottom={2}>Rate Artist and Art</Typography>

                        <Typography variant="body2" marginTop={2}>Art Quality</Typography>
                        <Rating
                          value={review.artQuality}
                          onChange={(event, newValue) => handleRatingChange('artQuality', newValue)}
                        />

                        <Typography variant="body2" marginTop={2}>Creativity</Typography>
                        <Rating
                          value={review.creativity}
                          onChange={(event, newValue) => handleRatingChange('creativity', newValue)}
                        />

                        <Typography variant="body2" marginTop={2}>Communication</Typography>
                        <Rating
                          value={review.communication}
                          onChange={(event, newValue) => handleRatingChange('communication', newValue)}
                        />

                        <TextField
                          fullWidth
                          label="Comments (optional)"
                          multiline
                          rows={2}
                          margin="normal"
                          value={review.comment}
                          onChange={handleCommentChange}
                        />

                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={handleSubmitReview}
                        >
                          Submit Review
                        </Button>
                      </Card>
                    )}
                  </Grid>
                </Grid>

                <Divider sx={{ marginTop: 4 }} />

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
