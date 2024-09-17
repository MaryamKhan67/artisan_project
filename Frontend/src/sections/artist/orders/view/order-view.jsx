import { useState, useEffect } from 'react';
import axios from 'axios';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../table-no-data';
import OrderTableRow from '../order-table-row';
import UserTableHead from '../order-table-head';
import TableEmptyRows from '../table-empty-rows';
import OrderTableToolbar from '../order-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function ArtistOrderPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const artistID = localStorage.getItem('artistID');
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:8080/api/artist/orders/get-artist-orders',
        { artistID },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleStatusUpdate = () => {
    fetchOrders();
  }


  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Orders</Typography>
      </Stack>

      <Card>
        <OrderTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            {orders.length === 0 ? (
              <Typography variant="h6" align="center" sx={{ py: 3 }}>
                No orders
              </Typography>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={orders.length}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'orderID', label: 'ID' },
                    { id: 'productName', label: 'Product Name' },
                    { id: 'customer', label: 'Customer Details' },
                    { id: 'status', label: 'Order Status' },
                    { id: '', label: "Actions" },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ord) => (
                      <OrderTableRow
                        key={ord._id}
                        orderID={ord.orderID}
                        customer={ord.shippingAddress}
                        productName={ord.product[0].productName}
                        status={ord.status}
                        onStatusUpdate={() => handleStatusUpdate()}
                      />
                    ))}

                  <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, orders.length)} />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
