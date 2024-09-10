import React from 'react';
import { Stack, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

const UserHeader = () => {
    const navigate = useNavigate();

    const userID = localStorage.getItem('userID');
    const handleLoginLogout = () => {
        if (userID) {
            localStorage.clear()
        }
        navigate('/login');
    };

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={5}>
            <Typography
                variant="h2"
                sx={{
                    fontFamily: 'Brush Script MT, cursive',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                Art Gallery <Logo />
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
                {userID && (
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Iconify icon="eva:heart-outline" />}
                        onClick={() => navigate('/wishlist')}
                    >
                        Wishlist
                    </Button>
                )}

                {userID && (
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Iconify icon="eva:shopping-cart-outline" />}
                        onClick={() => navigate('/cart')}
                    >
                        Cart
                    </Button>
                )}

                {userID && (
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Iconify icon="eva:car-outline" />}
                        onClick={() => navigate('/orders')}
                    >
                        Orders
                    </Button>
                )}

                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon={userID ? 'eva:log-out-outline' : 'eva:log-in-outline'} />}
                    onClick={handleLoginLogout}
                >
                    {userID ? 'Logout' : 'Login'}
                </Button>
            </Stack>
        </Stack>
    );
};

export default UserHeader;
