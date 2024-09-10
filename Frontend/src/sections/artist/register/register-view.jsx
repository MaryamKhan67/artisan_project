import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

export default function RegisterView() {
  const theme = useTheme();

  const router = useRouter();

  const [legalName, setLegalName] = useState('');
  const [artisticName, setArtisticName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [category, setCategory] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const checkArtisticNameUnique = async () => {
      if (artisticName.trim() !== '') {
        try {
          const response = await axios.post('http://localhost:8080/api/artist/check-artistic-name', { artisticName });
          if (response.data.exists) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              artisticName: 'Artistic Name is already taken',
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              artisticName: '',
            }));
          }
        } catch (error) {
          console.error('Error checking artistic name uniqueness:', error);
        }
      }
    };

    checkArtisticNameUnique();
  }, [artisticName]);

  const validateFields = () => {
    const newErrors = {};
    const mobileRegex = /^[6-9]\d{9}$/;
    const artisticNameRegex = /^\S+$/;

    if (!legalName) newErrors.legalName = 'Legal Name is required';

    if (!artisticName || !artisticNameRegex.test(artisticName)) {
      newErrors.artisticName = 'Artistic Name is required and cannot contain spaces';
    }

    if (!email) newErrors.email = 'Email Address is required';
    if (!password) newErrors.password = 'Password is required';

    if (!mobile) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (!mobileRegex.test(mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!category) newErrors.category = 'Category is required';
    return newErrors;
  };

  const handleClick = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post('http://localhost:8080/api/artist/register', {
        legalName,
        artisticName,
        email,
        password,
        mobile,
        category,
      });

      if (response.status === 200) {
        router.push('/artist/login');
      } else {
        toast.warning(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/artist/login');
  };

  const renderForm = (
    <>
      <Stack spacing={3} sx={{ mb: 3 }}>
        <TextField
          name="legalName"
          label="Legal Name"
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
          error={!!errors.legalName}
          helperText={errors.legalName}
        />
        <TextField
          name="artisticName"
          label="Artistic Name"
          value={artisticName}
          onChange={(e) => setArtisticName(e.target.value)}
          error={!!errors.artisticName}
          helperText={errors.artisticName}
        />
        <TextField
          name="email"
          label="Email Address"
          value={email}
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          name="mobile"
          label="Mobile Number"
          type="number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          error={!!errors.mobile}
          helperText={errors.mobile}
        />
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel id="category-label">Select Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={category}
              label="Select Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="Painter">Painter</MenuItem>
              <MenuItem value="Calligraphers">Calligraphers</MenuItem>
              <MenuItem value="Tattooists">Tattooists</MenuItem>
              <MenuItem value="Sculptors">Sculptors</MenuItem>
              <MenuItem value="Illustrators">Illustrators</MenuItem>
              <MenuItem value="Sketch Artist">Sketch Artist</MenuItem>
              <MenuItem value="Graphic Designers">Graphic Designers</MenuItem>
            </Select>
            {errors.category && <p style={{ color: 'red', fontSize: '12px', marginTop: '2px', marginLeft: '14px' }}>{errors.category}</p>}
          </FormControl>
        </Box>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        loading={loading}
      >
        Register
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.6),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Artist Registration</Typography>

          <Typography variant="body2" sx={{ mt: 1, mb: 5 }}>
            Already have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={navigateToLogin}>
              Login
            </Link>
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
