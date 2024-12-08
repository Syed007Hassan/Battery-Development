import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import { GridReadyEvent } from 'ag-grid-community';
import { DataGrid } from '../../components/DataGrid/DataGrid';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { getCars, deleteCar } from '../../services/api';
import { Car, CarResponse } from '../../types/car';
import { debounce } from 'lodash';

export const CarList = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 500),
    []
  );

  const fetchCars = useCallback(
    async (params = {}) => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getCars({
          search: searchTerm,
          page,
          limit: pageSize,
          ...params
        });

        setCars(response.cars);
        setTotalRows(response.total);
      } catch (error) {
        setError('Failed to fetch cars. Please try again later.');
        console.error('Error fetching cars:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, page, pageSize]
  );

  useEffect(() => {
    if (searchTerm !== undefined) {
      setPage(1);
      fetchCars();
    }
  }, [searchTerm, fetchCars]);

  const handleGridReady = (params: GridReadyEvent) => {
    fetchCars();
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    if (newPageSize !== pageSize) {
      setPage(1);
      setPageSize(newPageSize);
      fetchCars({ 
        page: 1, 
        limit: newPageSize,
        search: searchTerm 
      });
    } else if (newPage !== page) {
      setPage(newPage);
      fetchCars({ 
        page: newPage, 
        limit: pageSize,
        search: searchTerm 
      });
    }
  };

  const handleView = (car: Car) => {
    navigate(`/cars/${car._id}`);
  };

  const handleDelete = async (car: Car) => {
    try {
      await deleteCar(car._id);
      fetchCars({ page, limit: pageSize });
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            color: 'primary.dark',
            textAlign: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '4px',
              backgroundColor: 'primary.main',
              borderRadius: '2px',
            },
          }}
        >
          Electric Cars Catalog
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            backgroundColor: 'background.paper',
            borderRadius: 3,
            position: 'relative',
          }}
        >
          <SearchBar
            value={inputValue}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <DataGrid
            rowData={cars}
            totalRows={totalRows}
            page={page}
            pageSize={pageSize}
            onGridReady={handleGridReady}
            onViewClick={handleView}
            onDeleteClick={handleDelete}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </Paper>
      </Box>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 