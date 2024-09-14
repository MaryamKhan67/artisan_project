import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ArtCard({ art }) {
  const { _id, productName, images, description, artistID, price } = art;

  const renderTitle = (
    <Typography
      color="inherit"
      variant="subtitle1"
      align="center"
      sx={{
        mt: 2,
        typography: 'h6',
      }}
    >
      {productName}
    </Typography>
  );

  const renderPrice = (
    <Typography
      variant="subtitle2"
      align="center"
      sx={{
        color: 'text.secondary',
      }}
    >
      ₹{price}
    </Typography>
  );

  const renderDescription = (
    <Typography
      variant="body2"
      align="center"
      sx={{
        mt: 1,
        color: 'text.secondary',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}
    >
      {description}
    </Typography>
  );

  const renderCover = (
    <Box
      component="img"
      alt={productName}
      src={images[0]}
      sx={{
        top: 0,
        width: 1,
        height: 240,
        objectFit: 'cover',
        position: 'relative',
      }}
    />
  );

  const renderArtistInfo = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>

      <Typography variant="body2" sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }} component={Link} to={`/artist/${artistID.artisticName}`}>
        Artist: {artistID.artisticName}
      </Typography>
    </Box>
  );

  return (
    <Grid xs={12} sm={6} md={3}>
      <Card sx={{ position: 'relative', pb: 2 }}>
        <Link to={`/view-product/${_id}`} style={{ textDecoration: 'none' }}>
          {renderCover}
        </Link>
        <Box sx={{ pl: 2, pr: 2 }}>
          <Typography variant="h6" component={Link} to={`/view-product/${_id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
            {renderTitle}
          </Typography>
          {renderPrice}
          {renderArtistInfo}
          {renderDescription}
        </Box>
      </Card>
    </Grid>
  );
}

ArtCard.propTypes = {
  art: PropTypes.object.isRequired,
};
