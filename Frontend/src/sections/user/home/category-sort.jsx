import PropTypes from 'prop-types';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

CategorySort.propTypes = {
  categories: PropTypes.array.isRequired,
  onSort: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired
};

export default function CategorySort({ categories, onSort, selectedCategory }) {
  return (
    <TextField select size="small" value={selectedCategory} onChange={(e) => onSort(e.target.value)}>
      <MenuItem value="Select Category">
        Select Category
      </MenuItem>
      {categories.map((category, index) => (
        <MenuItem key={index} value={category}>
          {category}
        </MenuItem>
      ))}
    </TextField>
  );
}
