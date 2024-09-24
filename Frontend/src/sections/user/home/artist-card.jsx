import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ArtistCard({ artist }) {
  const { artisticName, logo, banner, category, description } = artist;

  const renderAvatar = (
    <Avatar
      alt={artisticName}
      src={logo || '/favicon/favicon.png'}
      sx={{
        width: 100,
        height: 100,
        mx: 'auto',
        position: 'relative',
        mt: -6,
      }}
    />
  );

  const renderTitle = (
    <Typography
      color="inherit"
      variant="subtitle1"
      align="center"
      sx={{
        mt: 1,
        typography: 'h6',
      }}
    >
      {artisticName}
    </Typography>
  );

  const renderCategory = (
    <Typography
      variant="subtitle2"
      align="center"
      sx={{
        color: 'text.secondary',
      }}
    >
      {category}
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
      {description || "No Description Available"}
    </Typography>
  );

  const renderCover = (
    <Box
      component="img"
      alt={artisticName}
      src={banner}
      sx={{
        top: 0,
        width: 1,
        height: 140,
        objectFit: 'cover',
        position: 'relative',
      }}
    />
  );

  return (
    <Grid xs={12} sm={6} md={3}>
      <Card sx={{ position: 'relative', pb: 2 }}>
        <Link to={`/view-artist/${artisticName}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {renderCover}
          {renderAvatar}
          <Box sx={{ pl: 2, pr: 2 }}>
            {renderTitle}
            {renderCategory}
            {renderDescription}
          </Box>
        </Link>
      </Card>
    </Grid>
  );
}

ArtistCard.propTypes = {
  artist: PropTypes.object.isRequired,
};
