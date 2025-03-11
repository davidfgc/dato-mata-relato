import { Link as LinkIcon } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const SourcesList = ({ sources }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Fuentes:
      </Typography>
      <Stack spacing={1}>
        {sources.map((source, sourceIndex) => (
          <Box
            key={sourceIndex}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <LinkIcon sx={{ fontSize: 16, color: 'text.secondary', mt: 0.3 }} />
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              <Typography variant="body2">{source}</Typography>
            </a>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

SourcesList.propTypes = {
  sources: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SourcesList;
