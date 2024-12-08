import { Box, CircularProgress, styled } from '@mui/material';

const LoaderOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
  backdropFilter: 'blur(2px)',
  transition: 'all 0.3s ease-in-out',
}));

export const Loader = () => (
  <LoaderOverlay>
    <CircularProgress 
      size={40}
      thickness={4}
      sx={{ 
        color: theme => theme.palette.primary.main,
        filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.1))'
      }}
    />
  </LoaderOverlay>
); 