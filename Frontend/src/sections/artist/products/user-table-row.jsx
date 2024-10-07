import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  TableRow,
  TableCell,
  Stack,
  IconButton,
  Popover,
  MenuItem,
} from '@mui/material';
import Iconify from 'src/components/iconify';

import axios from 'axios';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ProductTableRow({
  selected,
  productId,
  productName,
  images,
  price,
  stockQuantity,
  onDelete
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/artist/products/delete-product', { productId }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      onDelete();
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      handleCloseMenu();
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>

        <TableCell component="th" scope="row" padding="none">
          <Stack alignItems="start" marginLeft={2} spacing={2}>
            <img
              src={images[0] || '/favicon/favicon.png'}
              alt={productName}
              style={{ width: 40, height: 40, borderRadius: 4 }}
            />
          </Stack>
        </TableCell>

        <TableCell>{productName}</TableCell>

        <TableCell>{`₹${price}`}</TableCell>

        <TableCell>{stockQuantity}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Link to={`/artist/edit-product/${productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </Link>
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

ProductTableRow.propTypes = {
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  price: PropTypes.number.isRequired,
  stockQuantity: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  onDelete: PropTypes.func.isRequired
};
