const Car = require('../models/car');
const logger = require('../config/logger');

class CarService {
  async getAllCars(query = {}) {
    try {
      const { search, filter, page = 1, limit = 10 } = query;
      let dbQuery = {};

      // Handle search
      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        dbQuery.$or = [
          { Brand: searchRegex },
          { Model: searchRegex },
          { BodyStyle: searchRegex },
          { PowerTrain: searchRegex }
        ];
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
          }
        });
      }

      const total = await Car.countDocuments(dbQuery);
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const cars = await Car.find(dbQuery)
        .sort({ Brand: 1, Model: 1 })
        .skip(skip)
        .limit(parseInt(limit));

      return {
        cars,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
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