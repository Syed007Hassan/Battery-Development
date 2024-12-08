# Electric Cars Catalog with Advanced Data Grid
<img width="1494" alt="Screenshot 2024-12-09 at 00 20 07" src="https://github.com/user-attachments/assets/61ae9471-2ebc-457c-8329-0b9b1c196b8f">


## Overview

This application implements a comprehensive electric car catalog system featuring an advanced data grid interface. Built with Docker for seamless deployment, it combines a modern React frontend with an Express.js backend and MongoDB database. The system provides efficient data visualization, searching, filtering, and management capabilities for electric vehicle information.

## Description

The system leverages a sophisticated architecture that provides a seamless user experience while handling large datasets efficiently. It features server-side pagination, real-time search functionality, and a polished Material-UI interface. The application is fully containerized using Docker, ensuring consistent development and deployment environments.

## Technologies Used

Frontend: 
- React with TypeScript
- Material-UI (MUI)
- AG Grid Enterprise
- Vite for build tooling

Backend: 
- Express.js
- Node.js
- MongoDB

Infrastructure:   
- Docker
- Docker Compose

Additional Libraries:
- Axios for API calls
- Lodash for utility functions
- React Router for navigation

## Key Features

- Advanced data grid with dynamic column handling
- Server-side search and filtering capabilities
- Responsive Material Design interface
- Detailed car information view with modern styling
- Custom action buttons for view and delete operations
- Real-time data updates with loading states
- Efficient pagination system
- Error handling with user feedback
- Containerized application setup

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Quick Start with Docker Compose
1. Clone the repository:
   ```bash
   git clone https://github.com/Syed007Hassan/Battery-Development.git
   cd Battery-Development
   ```
2. Start the application using Docker Compose:
   ```bash
   docker-compose up --build 
   ```
3. Import initial data from CSV:
   ```bash
   # After containers are up and running
   docker-compose exec api npm run import-data
   ```
   This command will load the test data from the provided CSV file into MongoDB.

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Architecture Overview

### Frontend Architecture
The frontend is built with React and TypeScript, utilizing Material-UI for a consistent and modern design system. It features a sophisticated data grid implementation using AG Grid, providing advanced data manipulation capabilities. The application implements a custom theme system for consistent styling and includes loading states and error handling for improved user experience.

### Backend Architecture
The backend uses Express.js with MongoDB, implementing a robust service layer pattern. It includes comprehensive error handling, logging, and data validation. The API supports pagination, searching, and filtering operations, with all data operations being handled efficiently through MongoDB queries.

### Docker Implementation
The application is containerized using Docker, with separate containers for:
- Frontend React application
- Backend Express.js server
- MongoDB database
Docker Compose orchestrates these containers, handling networking and environment configuration automatically.
