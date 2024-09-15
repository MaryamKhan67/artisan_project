import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

ArtistSearch.propTypes = {
  artists: PropTypes.array.isRequired,
};

export default function ArtistSearch({ artists }) {
  const navigate = useNavigate(); // useNavigate hook to navigate

  return (
    <Autocomplete
      sx={{ width: 500 }}
      autoHighlight
      popupIcon={null}
      slotProps={{
        paper: {
          sx: {
            width: 500,
            [`& .${autocompleteClasses.option}`]: {
              typography: 'body2',
            },
          },
        },
      }}
      options={artists}
      getOptionLabel={(artist) => artist.artisticName}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, value) => {
        console.log(value.artisticName)
        if (value) {
          navigate(`/view-artist/${value.artisticName}`);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search artists..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
