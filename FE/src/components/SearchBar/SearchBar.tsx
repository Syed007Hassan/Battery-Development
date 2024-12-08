import { TextField, InputAdornment, Box, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledSearchBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  marginBottom: theme.spacing(4),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: 56,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      backgroundColor: theme.palette.background.default,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiInputAdornment-root': {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
}));

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  disabled?: boolean;
}

export const SearchBar = ({ value, onChange, onSearch, disabled }: SearchBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    onSearch(newValue);
  };

  return (
    <StyledSearchBox>
      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="Search cars..."
        value={value}
        onChange={handleChange}
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon 
                color={disabled ? "disabled" : "action"} 
                sx={{ fontSize: 22 }} 
              />
            </InputAdornment>
          ),
        }}
      />
    </StyledSearchBox>
  );
}; 