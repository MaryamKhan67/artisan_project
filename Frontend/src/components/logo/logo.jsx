import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
        width="100%" height="100%" viewBox="0 0 512 512"
      >
        <g id="Paintbrush">
          <path fill="#1E90FF" d="M455.7183,56.282A35.0266,35.0266,0,0,0,409.6227,53.25c-36.0083,27.5958-105.6771,83.156-172.1267,147.6263l73.6273,73.6273C375.5947,208.0537,431.1538,138.3848,458.75,102.3765A35.0237,35.0237,0,0,0,455.7183,56.282Z" />
          <path fill="#1E90FF" d="M189.2364,251.1158l71.647,71.6481c10.333-9.095,21.0974-18.9943,31.74-29.637l-73.7512-73.7512C208.2318,230.0184,198.33,240.7828,189.2364,251.1158Z" />
          <path fill="#1E90FF" d="M140.2334,312.1212l59.6457,59.6457c9.3417-6.8691,24.0668-18.0052,41.33-32.2977l-68.6776-68.6787C158.2376,288.0534,147.1014,302.7784,140.2334,312.1212Z" />
          <path fill="#1E90FF" d="M76.9113,349.6708l3.9712,14.8244c1.5637,12.483,16.2268,27.1034,28.7238,28.666,8.1369,2.23,18.2583,5.0042,30.2041,16.9489,11.1982,11.1992,14.3235,20.7695,16.4981,28.6212a60.959,60.959,0,0,0,31.2574-42.1532l-72.1448-72.1447A61.1812,61.1812,0,0,0,76.9113,349.6708Z" />
          <path fill="#1E90FF" d="M102.6742,418.4852c-10.5167-1.0414-32.868-15.101-40.065-29.3721L46.4358,450.5906a12.2343,12.2343,0,0,0,14.9728,14.9728l70-18.4143c-1.8115-6.62-3.14-11.4577-10.16-18.4773C114.2205,421.6447,109.382,420.3223,102.6742,418.4852Z" />
        </g>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    // TODO: Add Session Check navigate to Login
    <Link component={RouterLink} href="/dashboard" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
