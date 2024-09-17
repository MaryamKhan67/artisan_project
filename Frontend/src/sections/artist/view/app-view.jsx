import { useEffect, useState } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppNewsUpdate from '../overview/order-update';
import AppWidgetSummary from '../overview/app-widget-summary';

export default function AppView() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalOrders, setTotalOrders] = useState();
  const [totalArts, setTotalArts] = useState();

  const [totalReviews, setTotalReviews] = useState();
  const [overallRating, setOverallRating] = useState();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const artistID = localStorage.getItem("artistID")
        const response = await axios.post('http://localhost:8080/api/artist/orders/get-recent-orders', { artistID });
        console.log(response.data)
        setRecentOrders(response.data.recentOrders);
        setTotalRevenue(response.data.totalRevenue)
        setTotalOrders(response.data.totalOrders)
        setTotalArts(response.data.arts)
        setTotalReviews(response.data.totalReviews)
        setOverallRating(response.data.overallRating)
      } catch (error) {
        console.error('Failed to fetch recent orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Revenue"
            total={numeral(totalRevenue).format('0.00a')}  // Format number
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Arts"
            total={numeral(totalArts).format('0.00a')}  // Format number
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/art.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Orders"
            total={numeral(totalOrders).format('0.00a')}  // Format number
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={`${totalReviews} Reviews`}
            total={overallRating}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/star.png" />}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          {loading ? (
            <Typography>Loading recent orders...</Typography>
          ) : (
            <AppNewsUpdate
              title="Recent Orders"
              list={recentOrders.map((order) => ({
                id: order.orderID,
                title: `Order #${order.orderID}`,
                description: order.product[0].productName,
                image: order.product[0].images[0],
                postedAt: new Date(order.createdAt),
              }))}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
