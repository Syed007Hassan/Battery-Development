import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button 
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
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
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to List
        </Button>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {car.Brand} {car.Model}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Performance</Typography>
              <Typography>Acceleration: {car.AccelSec} sec</Typography>
              <Typography>Top Speed: {car.TopSpeed_KmH} km/h</Typography>
              <Typography>Range: {car.Range_Km} km</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Specifications</Typography>
              <Typography>Body Style: {car.BodyStyle}</Typography>
              <Typography>Segment: {car.Segment}</Typography>
              <Typography>Seats: {car.Seats}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Charging</Typography>
              <Typography>Efficiency: {car.Efficiency_WhKm} Wh/km</Typography>
              <Typography>Fast Charge: {car.FastCharge_KmH} km/h</Typography>
              <Typography>Rapid Charge: {car.RapidCharge}</Typography>
              <Typography>Plug Type: {car.PlugType}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Price</Typography>
              <Typography>€{car.PriceEuro.toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}; 