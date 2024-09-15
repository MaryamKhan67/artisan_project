import React, { useState } from 'react';
import { Container, Stack, Typography, Button, TextField, Card, Box } from '@mui/material';
import Iconify from 'src/components/iconify';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import { LoadingButton } from '@mui/lab';

export default function AddProductForm() {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const validateForm = () => {
        const newErrors = {};

        if (!productName.trim()) {
            newErrors.productName = "Product Name is required";
        }
        if (!description.trim()) {
            newErrors.description = "Description is required";
        }
        if (images.length === 0) {
            newErrors.images = "At least one image is required";
        }
        if (!price.trim() || parseFloat(price) <= 0) {
            newErrors.price = "A valid price is required";
        }
        if (!quantity.trim() || parseInt(quantity, 10) <= 0) {
            newErrors.quantity = "A valid quantity is required";
        }

        return newErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('productName', productName);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('stockQuantity', quantity);
            formData.append('artistID', localStorage.getItem("artistID"));

            for (let i = 0; i < images.length; i += 1) {
                formData.append('images', images[i]);
            }

            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/api/artist/products/add-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Product added successfully:', response.data);

            router.push('/artist/arts');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    toast.error('Token Expired, Login Again.')
                    localStorage.removeItem('token');
                    router.push('/artist/login');
                } else {
                    toast.error('An error occurred while adding the product.')
                }
            } else {
                toast.error('Network error or server is unreachable.')
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (event) => {
        setImages(event.target.files);
    };

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Add New Art</Typography>
            </Stack>

            <Card sx={{ padding: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" gap={2}>

                        <Box display="flex" alignItems="center" gap={2} p={2} border="1px dashed #ccc" borderRadius={2}>
                            <Iconify icon="eva:cloud-upload-outline" width={24} height={24} />

                            <div>
                                <Typography variant="body1">Upload Images</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    click to select files
                                </Typography>
                                {images.length > 0 && (
                                    <Typography variant="body1" color="textPrimary">
                                        {images.length} image{images.length > 1 ? 's' : ''} selected
                                    </Typography>
                                )}
                            </div>

                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    marginLeft: 'auto',
                                }}
                            >
                                Select Files
                                <input type="file" hidden multiple onChange={handleImageChange} />
                            </Button>
                        </Box>
                        {errors.images && <Typography color="error">{errors.images}</Typography>}

                        <TextField
                            label="Product Name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            fullWidth
                            error={!!errors.productName}
                            helperText={errors.productName}
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                            error={!!errors.description}
                            helperText={errors.description}
                        />

                        <TextField
                            label="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                            fullWidth
                            error={!!errors.price}
                            helperText={errors.price}
                        />
                        <TextField
                            label="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            type="number"
                            fullWidth
                            error={!!errors.quantity}
                            helperText={errors.quantity}
                        />
                        <LoadingButton
                            type="submit"
                            variant="contained" color="inherit"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            loading={loading}
                        >
                            Add New Art
                        </LoadingButton>
                    </Box>
                </form>
            </Card>
        </Container>
    );
}
