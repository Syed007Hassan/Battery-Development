const fs = require('fs');
const { parse } = require('csv-parse');
const mongoose = require('mongoose');
const Car = require('../models/car');
const path = require('path');
require('dotenv').config();

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Car.deleteMany({});
    console.log('Cleared existing data');

    const csvPath = path.join(__dirname, '../BMW_Aptitude_Test_Test_Data_ElectricCarData.csv');
    
    const parser = fs
      .createReadStream(csvPath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true
      }));

    let count = 0;
    for await (const record of parser) {
      // Helper function to safely parse numbers
      const safeParseInt = (value) => {
        if (!value || value === '') return 0;
        const parsed = parseInt(value);
        return isNaN(parsed) ? 0 : parsed;
      };

      const safeParseFloat = (value) => {
        if (!value || value === '') return 0;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
      };

      // Parse date safely
      const safeParseDate = (dateStr) => {
        if (!dateStr) return new Date();
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date) ? date : new Date();
      };

      try {
        // Convert string values to appropriate types with safety checks
        const car = new Car({
          Brand: record.Brand || '',
          Model: record.Model || '',
          AccelSec: safeParseFloat(record.AccelSec),
          TopSpeed_KmH: safeParseInt(record.TopSpeed_KmH),
          Range_Km: safeParseInt(record.Range_Km),
          Efficiency_WhKm: safeParseInt(record.Efficiency_WhKm),
          FastCharge_KmH: safeParseInt(record.FastCharge_KmH),
          RapidCharge: record.RapidCharge || '',
          PowerTrain: record.PowerTrain || '',
          PlugType: record.PlugType || '',
          BodyStyle: record.BodyStyle || '',
          Segment: record.Segment || '',
          Seats: safeParseInt(record.Seats),
          PriceEuro: safeParseInt(record.PriceEuro),
          Date: safeParseDate(record.Date)
        });
        
        await car.save();
        count++;
      } catch (err) {
        console.error(`Error saving record:`, record);
        console.error(`Error details:`, err.message);
      }
    }

    console.log(`Data import completed. ${count} records imported.`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData(); 