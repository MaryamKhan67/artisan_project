import PropTypes from 'prop-types';
import {
  TableRow,
  TableCell,
  Button,
  Typography,
} from '@mui/material';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function OrderTableRow({
  orderID,
  customer,
  productName,
  status,
  onStatusUpdate,
}) {


  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/artist/orders/update-status', {
        orderID,
        status: newStatus,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      onStatusUpdate();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const renderStatusButton = () => {
    if (status === 'Pending') {
      return (
        <Button variant="outlined" color="primary" onClick={() => handleStatusChange('Completed')}>
          Mark as Completed
        </Button>
      );
    }

    if (status === 'Completed') {
      return (
        <Button variant="outlined" color="success" onClick={() => handleStatusChange('Shipped')}>
          Mark as Shipped
        </Button>
      );
    }

    if (status === 'Shipped') {
      return (
        <Button variant="outlined" color="success" onClick={() => handleStatusChange('Delivered')}>
          Mark as Delivered
        </Button>
      );
    }
    return <Typography variant="body2" color='green'>Delivered</Typography>;
  };

  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell>{orderID}</TableCell>
      <TableCell>{productName}</TableCell>
      <TableCell>{`${customer.name} | ${customer.mobile} | ${customer.flatNo}, ${customer.streetAddress}, ${customer.city}, ${customer.state}, ${customer.pincode}`}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell>{renderStatusButton()}</TableCell>
    </TableRow>
  );
}

OrderTableRow.propTypes = {
  orderID: PropTypes.number.isRequired,
  customer: PropTypes.shape({
    name: PropTypes.string,
    mobile: PropTypes.string,
    flatNo: PropTypes.string,
    streetAddress: PropTypes.string,
    pincode: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
  }).isRequired,
  productName: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};
