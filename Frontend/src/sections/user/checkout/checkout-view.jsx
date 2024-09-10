import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { CircularProgress, Button, Grid, Card, CardMedia, CardContent, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserHeader from 'src/layouts/home/user-header';
import Iconify from 'src/components/iconify';
import axios from 'axios';

export default function CheckoutView() {
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');
  if (!userID) {
    navigate("/login");
  }

  const [cartProducts, setCartProducts] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    flatNo: '',
    streetAddress: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    deliveryNotes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

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

    async function getUserDetails() {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/home/get-user/${userID}`);
        const { data } = response;
        setFormData({
          ...formData,
          name: data.userName,
          email: data.email,
          mobile: data.mobile
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
    fetchCartProducts();
    getUserDetails();

    return () => {
      document.body.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const formErrors = {};

    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) formErrors.email = "Valid email is required";
    if (!formData.mobile || formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) formErrors.mobile = "Valid 10-digit mobile number is required";
    if (!formData.flatNo) formErrors.flatNo = "Flat No. is required";
    if (!formData.streetAddress) formErrors.streetAddress = "Street Address is required";
    if (!formData.pincode || formData.pincode.length !== 6 || !/^\d+$/.test(formData.pincode)) formErrors.pincode = "Valid 6-digit pincode is required";
    if (!formData.city) formErrors.city = "City is required";
    if (!formData.state) formErrors.state = "State is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handlePay = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/user/checkout/create-order', {
        amount: totalAmount,
        currency: 'INR'
      });
      const { orderId, amount } = response.data;

      // Configure Razorpay options
      const options = {
        key: 'rzp_test_lpLT4HA4yj6FDK',
        amount,
        currency: 'INR',
        name: 'Art Gallery',
        description: 'Test Transaction',
        image: '/favicon/favicon.png',
        order_id: orderId,
        async handler(resp) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = resp;
          try {
            await axios.post('http://localhost:8080/api/user/checkout/place-order', {
              userID,
              name: formData.name,
              email: formData.email,
              mobile: formData.mobile,
              flatNo: formData.flatNo,
              streetAddress: formData.streetAddress,
              landmark: formData.landmark,
              pincode: formData.pincode,
              city: formData.city,
              state: formData.state,
              deliveryNotes: formData.deliveryNotes,
              payment_id: razorpay_payment_id,
              order_id: razorpay_order_id,
              signature: razorpay_signature
            });
            navigate('/order-success');
          } catch (err) {
            console.error('Error creating order:', err);
            toast.error(err);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error during payment: ', error);
      toast.error(error.message);
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
    <Container>
      <UserHeader />

      <Card sx={{ backgroundColor: "white", padding: 4, paddingTop: 2 }} elevation={12}>
        <Typography variant="h4" marginBottom={3} sx={{ fontWeight: 'bold' }}>Checkout</Typography>

        <Grid container spacing={4}>

          <Grid item xs={12} md={8}>
            <Typography variant="h5" marginBottom={2} sx={{ fontWeight: 'bold' }}>Shipping Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  error={!!errors.email}
                  helperText={errors.email}
                  onChange={handleChange}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Flat No, Building Name"
                  name="flatNo"
                  value={formData.flatNo}
                  onChange={handleChange}
                  error={!!errors.flatNo}
                  helperText={errors.flatNo}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address, Road"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  error={!!errors.streetAddress}
                  helperText={errors.streetAddress}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={!!errors.city}
                  helperText={errors.city}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={!!errors.state}
                  helperText={errors.state}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Notes"
                  name="deliveryNotes"
                  value={formData.deliveryNotes}
                  onChange={handleChange}
                  sx={{ backgroundColor: '#f9f9f9', borderRadius: '5px' }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Cart Items and Total */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" marginBottom={2} sx={{ fontWeight: 'bold' }}>Your Cart</Typography>
            <Grid container spacing={2}>
              {cartProducts.map((item) => (
                <Grid item xs={12} key={item.productID._id}>
                  <Card sx={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                    <Grid container>
                      <Grid item xs={4}>
                        <CardMedia
                          component="img"
                          height="100"
                          image={item.productID.images[0]}
                          alt={item.productID.productName}
                          sx={{ objectFit: 'cover', borderRadius: '5px' }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <CardContent>
                          <Typography variant="h6" noWrap>{item.productID.productName}</Typography>
                          <Typography variant="body1">₹{item.productID.price}</Typography>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="space-between" marginTop={3} sx={{ fontWeight: 'bold' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">₹{totalAmount}/-</Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handlePay}
              sx={{
                marginTop: 3,
                padding: '10px 0',
                fontWeight: 'bold',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
              fullWidth
            >
              Pay Now
            </Button>
          </Grid>
        </Grid>
      </Card>

    </Container >
  );
}
