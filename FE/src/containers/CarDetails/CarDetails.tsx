import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Divider,
  Chip
} from '@mui/material';
import { ArrowBack, Speed, Battery90, Timer } from '@mui/icons-material';
import { getCarById } from '../../services/api';
import { Car } from '../../types/car';

export const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        if (id) {
          const data = await getCarById(id);
          setCar(data);
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };

    fetchCar();
  }, [id]);

  if (!car) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Back to List
      </Button>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom color="primary.dark">
          {car.Brand} {car.Model}
        </Typography>
        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          {/* Key Metrics */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Speed color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">{car.TopSpeed_KmH} km/h</Typography>
                <Typography variant="body2" color="text.secondary">Top Speed</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Battery90 color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">{car.Range_Km} km</Typography>
                <Typography variant="body2" color="text.secondary">Range</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Timer color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">{car.AccelSec}s</Typography>
                <Typography variant="body2" color="text.secondary">0-100 km/h</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Specifications */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Vehicle Details</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DetailRow label="Body Style" value={car.BodyStyle} />
              <DetailRow label="Segment" value={car.Segment} />
              <DetailRow label="Seats" value={car.Seats} />
              <DetailRow label="Power Train" value={car.PowerTrain} />
            </Box>
          </Grid>

          {/* Charging */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Charging</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DetailRow label="Efficiency" value={`${car.Efficiency_WhKm} Wh/km`} />
              <DetailRow label="Fast Charge" value={`${car.FastCharge_KmH} km/h`} />
              <DetailRow label="Rapid Charge" value={car.RapidCharge} />
              <DetailRow label="Plug Type" value={car.PlugType} />
            </Box>
          </Grid>

          {/* Price */}
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                bgcolor: 'primary.light', 
                color: 'white',
                borderRadius: 2,
                mt: 2
              }}
            >
              <Typography variant="h5">
                Price: €{car.PriceEuro.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography color="text.secondary">{label}</Typography>
    <Typography fontWeight="500">{value}</Typography>
  </Box>
); 