# Healthify Ever Care Service

A specialized microservice for the Healthify telemedicine platform that provides curated care programs for subscribed patients. This service integrates with existing appointment, communication, and EHR services to deliver comprehensive healthcare management.

## Features

### 🏥 Ever Care Program Management
- **Patient Enrollment**: Subscribe patients to different care tiers (Basic, Premium, Elite)
- **Provider Assignment**: Assign dedicated healthcare providers to enrolled patients
- **Subscription Management**: Handle enrollment status, renewals, and terminations

### 🎯 Care Goals & Tasks
- **Health Goals**: Set personalized health objectives (exercise, diet, medication, lifestyle)
- **Task Management**: Create, track, and manage daily/weekly/monthly health tasks
- **Progress Tracking**: Monitor goal completion and patient progress
- **Priority Management**: Set task priorities and due dates

### 📱 Wearable Device Integration
- **Device Registration**: Connect fitness trackers, smartwatches, and health monitors
- **Data Synchronization**: Automatically sync health metrics from devices
- **EHR Integration**: Store device data in OpenMRS system
- **Real-time Monitoring**: Track vital signs, activity levels, and health trends

### 🔔 Smart Notifications
- **Task Reminders**: Daily notifications for due tasks
- **Overdue Alerts**: Urgent notifications for missed tasks
- **Progress Updates**: Weekly summaries and goal achievement notifications
- **Enrollment Reminders**: Renewal notifications for expiring subscriptions

### 🔗 Service Integration
- **Appointment Service**: Schedule recurring consultations and home visits
- **Communication Service**: Send notifications and maintain care conversations
- **EHR Service**: Sync health data with OpenMRS system

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Ever Care     │    │   Appointment   │    │ Communication  │
│   Service       │◄──►│   Service       │◄──►│   Service      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │   PostgreSQL    │    │   PostgreSQL   │
│   Database      │    │   Database      │    │   Database     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│   OpenMRS       │
│   EHR System    │
└─────────────────┘
```

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Integration**: Axios for HTTP communication
- **Architecture**: Microservices with REST APIs

## Database Schema

### Core Tables
- `ever_care_enrollments` - Patient program subscriptions
- `care_goals` - Health objectives and targets
- `care_tasks` - Individual tasks related to goals
- `task_completions` - Task completion tracking
- `wearable_devices` - Connected health devices
- `device_metrics` - Health data from devices

### Key Relationships
- Patient → Enrollment → Goals → Tasks → Completions
- Patient → Devices → Metrics → EHR Sync

## API Endpoints

### Ever Care Program
- `POST /api/evercare/enroll` - Enroll patient in program
- `GET /api/evercare/enrollment/:patientId` - Get enrollment details
- `PUT /api/evercare/enrollment/:patientId` - Update enrollment
- `DELETE /api/evercare/enrollment/:patientId` - Terminate enrollment

### Care Goals
- `POST /api/goals` - Create new health goal
- `GET /api/goals/patient/:patientId` - Get patient goals
- `PUT /api/goals/:goalId/patient/:patientId` - Update goal
- `GET /api/goals/patient/:patientId/overdue` - Get overdue goals

### Care Tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/patient/:patientId` - Get patient tasks
- `POST /api/tasks/:taskId/patient/:patientId/complete` - Complete task
- `GET /api/tasks/patient/:patientId/due-today` - Get today's tasks

### Wearable Devices
- `POST /api/devices/register` - Register new device
- `GET /api/devices/patient/:patientId` - Get patient devices
- `POST /api/devices/:deviceId/patient/:patientId/sync` - Sync device data
- `POST /api/devices/patient/:patientId/sync-ehr` - Sync to EHR

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthify_evercare
DB_USER=your_username
DB_PASSWORD=your_password

# Service URLs
APPOINTMENT_SERVICE_URL=http://localhost:5003
COMMUNICATION_SERVICE_URL=http://localhost:5004
EHR_SERVICE_URL=http://localhost:5001

# Service Configuration
PORT=5005
NODE_ENV=development
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Healthify_EvercareService
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   # Create PostgreSQL database
   createdb healthify_evercare
   
   # Run migrations (auto-sync enabled)
   npm start
   ```

5. **Start the service**
   ```bash
   npm start
   ```

## Usage Examples

### Enroll a Patient
```javascript
const enrollment = await fetch('/api/evercare/enroll', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patient_id: 'uuid-here',
    provider_id: 'uuid-here',
    subscription_tier: 'premium',
    weekly_consultations: 2,
    monthly_consultations: 8,
    home_visits_per_month: 2
  })
});
```

### Create a Health Goal
```javascript
const goal = await fetch('/api/goals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patient_id: 'uuid-here',
    provider_id: 'uuid-here',
    title: 'Exercise Routine',
    description: 'Establish daily exercise habits',
    category: 'exercise',
    priority: 'high',
    target_date: '2024-12-31'
  })
});
```

### Register a Wearable Device
```javascript
const device = await fetch('/api/devices/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patient_id: 'uuid-here',
    device_name: 'Fitbit Charge 5',
    device_type: 'fitness_tracker',
    integration_type: 'api',
    api_endpoint: 'https://api.fitbit.com/v1/user/-/activities',
    api_key: 'your-api-key'
  })
});
```

## Service Integration

### With Appointment Service
- Creates recurring consultation schedules
- Manages weekly/monthly appointment quotas
- Integrates home visit scheduling

### With Communication Service
- Sends task reminders and notifications
- Maintains care conversation threads
- Delivers progress updates and summaries

### With EHR Service
- Syncs wearable device metrics
- Stores care plan information
- Tracks patient progress over time

## Monitoring & Health Checks

- **Health Endpoint**: `GET /health`
- **Service Status**: Monitors integration with external services
- **Database Connectivity**: Real-time database health monitoring
- **Performance Metrics**: Response time and error rate tracking

## Development

### Project Structure
```
├── config/          # Database and service configuration
├── controllers/     # Request/response handlers
├── middlewares/     # Custom middleware functions
├── models/          # Database models and associations
├── routes/          # API route definitions
├── services/        # Business logic and external integrations
├── server.js        # Main application entry point
└── README.md        # This file
```

### Adding New Features
1. Create model in `models/` directory
2. Add business logic in `services/` directory
3. Create controller in `controllers/` directory
4. Define routes in `routes/` directory
5. Update main server file

## Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## Deployment

### Production Considerations
- Enable proper authentication middleware
- Use environment-specific configurations
- Implement rate limiting and security headers
- Set up monitoring and logging
- Configure database connection pooling

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5005
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For questions and support, please contact the Healthify development team or create an issue in the repository.