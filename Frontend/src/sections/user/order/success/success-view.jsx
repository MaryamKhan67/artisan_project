import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { primary } from 'src/theme/palette';

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: primary.dark }}>
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          textAlign="center"
        >
          <img src="/assets/icons/success.gif" alt='success' />
          <Typography variant="h4" color="white" gutterBottom>
            Order Successful!
          </Typography>
          <Typography color="white" variant="body1">
            Thank you for your purchase :)
          </Typography>
          <Typography color="white" variant="body1" marginBottom={3}>
            Your order has been placed successfully.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/orders')}>
            Manage Orders
          </Button>
        </Box>
      </Container>
    </div>
  );
}
