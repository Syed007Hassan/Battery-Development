const Car = require('../models/car');
const logger = require('../config/logger');

class CarService {
  async getAllCars(query = {}) {
    try {
      const { search, filter, sort, page = 1, limit = 10 } = query;
      let dbQuery = {};

      // Handle search
      if (search) {
        dbQuery.$text = { $search: search };
      }

      // Handle filters
      if (filter) {
        const filters = Array.isArray(filter) ? filter : [filter];
        filters.forEach(filterItem => {
          const { field, operator, value } = JSON.parse(filterItem);
          switch (operator) {
            case 'contains':
              dbQuery[field] = { $regex: value, $options: 'i' };
              break;
            case 'equals':
              dbQuery[field] = value;
              break;
            case 'startsWith':
              dbQuery[field] = { $regex: `^${value}`, $options: 'i' };
              break;
            case 'endsWith':
              dbQuery[field] = { $regex: `${value}$`, $options: 'i' };
              break;
            case 'isEmpty':
              dbQuery[field] = { $in: ['', null] };
              break;
            case 'greaterThan':
              dbQuery[field] = { $gt: parseFloat(value) };
              break;
            case 'lessThan':
              dbQuery[field] = { $lt: parseFloat(value) };
              break;
            case 'between':
              const [min, max] = value.split(',');
              dbQuery[field] = { $gte: parseFloat(min), $lte: parseFloat(max) };
              break;
          }
        });
      }

      const skip = (page - 1) * limit;
      
      // Handle sorting
      let sortOptions = {};
      if (sort) {
        const { field, direction } = JSON.parse(sort);
        sortOptions[field] = direction === 'desc' ? -1 : 1;
      }

      const [cars, total] = await Promise.all([
        Car.find(dbQuery)
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit)),
        Car.countDocuments(dbQuery)
      ]);

      logger.info(`Retrieved ${cars.length} cars from database`);
      return {
        cars,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error in getAllCars:', error);
      throw error;
    }
  }

  async getCarById(id) {
    try {
      const car = await Car.findById(id);
      logger.info(`Retrieved car with ID: ${id}`);
      return car;
    } catch (error) {
      logger.error(`Error retrieving car with ID ${id}:`, error);
      throw error;
    }
  }

  async createCar(carData) {
    const car = new Car(carData);
    return car.save();
  }

  async updateCar(id, carData) {
    return Car.findByIdAndUpdate(id, carData, { new: true });
  }

  async deleteCar(id) {
    return Car.findByIdAndDelete(id);
  }
}

module.exports = new CarService(); 