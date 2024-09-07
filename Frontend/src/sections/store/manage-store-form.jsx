import React, { useState, useEffect } from 'react';
import { Container, Stack, Typography, Card, Button, Box, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';

export default function ManageStoreForm() {
    const [artisticName, setArtisticName] = useState('');
    const [category, setCategory] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [logo, setLogo] = useState(null);
    const [banner, setBanner] = useState(null);
    const [description, setDescription] = useState('');

    const router = useRouter();
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStoreDetails();
    }, []);

    const fetchStoreDetails = async () => {
        try {
            const artistID = localStorage.getItem("artistID");
            const token = localStorage.getItem('token');

            const response = await axios.post('http://localhost:8080/api/artist/store/get', { artistID }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setArtisticName(response.data.artisticName);
            setCategory(response.data.category);
            setEmail(response.data.email);
            setMobile(response.data.mobile);
            setLogo(response.data.logo);
            setBanner(response.data.banner);
            setDescription(response.data.description);
        } catch (error) {
            console.error('Failed to fetch store details', error);
        }
    };

    const handleLogoChange = async (event) => {
        const selectedLogo = event.target.files[0];
        if (selectedLogo) {
            const formData = new FormData();
            formData.append('logo', selectedLogo);
            formData.append('artistID', localStorage.getItem("artistID"));

            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:8080/api/artist/store/edit-logo', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                toast.success('Logo updated successfully!');
                setLogo(response.data.artist.logo);
            } catch (error) {
                handleApiError(error);
            }
        }
    };

    const handleBannerChange = async (event) => {
        const selectedBanner = event.target.files[0];
        if (selectedBanner) {
            const formData = new FormData();
            formData.append('banner', selectedBanner);
            formData.append('artistID', localStorage.getItem("artistID"));

            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:8080/api/artist/store/edit-banner', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                toast.success('Banner updated successfully!');
                setBanner(response.data.artist.banner);
            } catch (error) {
                handleApiError(error);
            }
        }
    };

    const handleApiError = (error) => {
        if (error.response && error.response.status === 401) {
            toast.error('Token Expired, Login Again.');
            localStorage.removeItem('token');
            router.push('/login');
        } else {
            toast.error('An error occurred while updating.');
        }
    };

    const handleDeleteAccount = async () => {
        const artistID = localStorage.getItem("artistID");
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`http://localhost:8080/api/artist/store/delete/${artistID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            toast.success('Account deleted successfully!');
            localStorage.removeItem('token');
            router.push('/login'); // Redirect to login after deletion
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)

        const formData = {
            artistID: localStorage.getItem("artistID"),
            description,
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/artist/store/edit-description', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            toast.success('Description updated successfully!');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Token Expired, Login Again.');
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                toast.error('An error occurred while updating store details.');
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <Container>
            <ToastContainer position="top-center" autoClose={3000} />
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Manage Store</Typography>
            </Stack>

            <Card sx={{ padding: 3 }}>
                {/* Banner Section */}
                <Box
                    mb={3}
                    borderRadius="12px"
                    overflow="hidden"
                    position="relative"
                    onClick={() => document.getElementById('bannerInput').click()}
                    sx={{
                        '&:hover .updatePlaceholderBanner': {
                            display: 'flex',
                        },
                    }}
                >
                    {banner ? (
                        <img
                            src={banner}
                            alt="Banner"
                            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                        />
                    ) : (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height="300px"
                            bgcolor="#f0f0f0"
                        >
                            <Iconify icon="eva:cloud-upload-outline" width={50} height={50} />
                            <Typography variant="subtitle1" ml={2}>Click to upload banner</Typography>
                        </Box>
                    )}
                    <Box
                        className="updatePlaceholderBanner"
                        display="none"
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
                        bgcolor="rgba(0, 0, 0, 0.5)"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                        textAlign="center"
                        sx={{
                            cursor: 'pointer',
                        }}
                    >
                        <Iconify icon="eva:cloud-upload-outline" width={50} height={50} />
                        <Typography variant="h6">Update Banner</Typography>
                    </Box>
                    <input
                        type="file"
                        id="bannerInput"
                        hidden
                        onChange={handleBannerChange}
                    />
                </Box>

                <Box display="flex" alignItems="center" gap={3} mb={4} position="relative">
                    <Box
                        position="relative"
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '8px',
                            '&:hover .updatePlaceholderLogo': {
                                display: 'flex',
                            },
                        }}
                        onClick={() => document.getElementById('logoInput').click()}
                    >
                        <Avatar
                            alt={artisticName}
                            src={logo}
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 'inherit',
                                border: '2px solid #ccc',
                            }}
                        />
                        <Box
                            className="updatePlaceholderLogo"
                            display="none"
                            position="absolute"
                            top="0"
                            left="0"
                            width="100%"
                            height="100%"
                            bgcolor="rgba(0, 0, 0, 0.5)"
                            alignItems="center"
                            justifyContent="center"
                            color="white"
                            textAlign="center"
                            sx={{
                                cursor: 'pointer',
                            }}
                        >
                            <Iconify icon="eva:cloud-upload-outline" width={40} height={40} />
                            <Typography variant="subtitle1">Update Logo</Typography>
                        </Box>
                        <input
                            type="file"
                            id="logoInput"
                            hidden
                            onChange={handleLogoChange}
                        />
                    </Box>

                    <Box>
                        <Typography variant="h5" fontWeight="bold">{artisticName}</Typography>
                        <Typography variant="subtitle1" color="textSecondary">{category}</Typography>
                        <Typography variant="body1"><strong>Email:</strong> {email}</Typography>
                        <Typography variant="body1"><strong>Mobile:</strong> {mobile}</Typography>
                    </Box>
                    <input
                        type="file"
                        id="logoInput"
                        hidden
                        onChange={handleLogoChange}
                    />
                </Box>

                <Box>
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <LoadingButton onClick={handleSubmit} loading={loading}>Set Description</LoadingButton>
                </Box>

            </Card>

            <Button
                variant="contained"
                color="error"
                onClick={() => setOpenDialog(true)} // Open dialog on click
                sx={{ mt: 3 }}
            >
                Delete Account
            </Button>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action is irreversible and all your data will be lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}
