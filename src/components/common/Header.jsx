import { AppBar, Box, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        ></Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            aria-label="Twitter/X profile"
            color="inherit"
            component="a"
            href="https://x.com/datosprogres"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
