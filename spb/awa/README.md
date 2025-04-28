# AWA - Admin Web Application

AWA is the administrative web interface for the Sport Booking platform, allowing administrators to manage clubs, units, users, and other aspects of the system.

## Features

- **Authentication**: Secure login and session management
- **Dashboard**: Overview of system statistics and recent activities
- **Clubs Management**: Create, view, update, and delete sports clubs
- **Units Management**: Manage sports facilities within clubs
- **User Management**: Administer user accounts and permissions
- **Analytics**: Visualize business metrics and performance data
- **Settings**: Configure system parameters

## Technology Stack

- **Frontend Framework**: React.js with Next.js
- **UI Components**: Shadcn UI with Tailwind CSS
- **Data Visualization**: Recharts for charts and graphs
- **API Communication**: Fetch API for RESTful API requests
- **State Management**: React Context API and React Hooks
- **Routing**: Next.js App Router
- **Build Tool**: Next.js

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (v18.x or later recommended)
- npm (v8.x or later) or yarn (v1.22.x or later)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd spb/awa
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://127.0.0.1:3000/api/v1
   ```

## Running the Application

### Development Mode

To start the development server:

```bash
npm run dev
# or
yarn dev
```

This will start the application in development mode with hot-reload enabled. The application will be available at [http://localhost:3001](http://localhost:3001).

### Production Build

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## API Integration

The application integrates with the Sport Booking API defined in the Postman collection file at `Sport Booking.postman_collection.json`. The API endpoints include:

- **Authentication**: Login, logout, register, password reset
- **Users**: User management (CRUD operations)
- **Clubs**: Sports club management
- **Units**: Sports facility management
- **Analytics**: Business metrics and statistics

### Fallback Data Mechanism

The application implements a fallback mechanism for API calls:

1. When an API call is made, the application first attempts to fetch data from the actual API endpoint
2. If the API call fails (server error, network issue, etc.), the application automatically falls back to using predefined mock data
3. This ensures that the application remains functional even when the backend API is unavailable

Mock data is defined in `src/data/mock-data.ts` and is used as a fallback for various features:
- Club listings and details
- User management
- Analytics and statistics
- Promotional content

## Authentication

The application uses JWT (JSON Web Token) for authentication. When you log in, the token is stored in the browser's localStorage and included in subsequent API requests.

Default login credentials (if using the development backend):
- Email: admin@example.com
- Password: password123

## Project Structure

```
src/
├── app/              # Next.js app directory with route components
│   ├── analyze/      # Analytics and reporting
│   ├── api/          # API routes for local development and fallback
│   ├── auth/         # Authentication pages
│   ├── clubs/        # Club management
│   ├── units/        # Unit management
│   └── users/        # User management
├── components/       # Reusable UI components
│   ├── layout/       # Layout components (sidebar, header, etc.)
│   └── ui/           # UI components (buttons, cards, etc.)
├── contexts/         # React Context providers
├── data/             # Mock data for fallback
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and shared code
├── services/         # API services and utilities
│   └── api/          # API client and service modules
└── utils/            # Utility functions
```

## CORS Configuration

The application is configured to make direct API calls to the backend server. The backend server should be configured to accept CORS requests from the frontend application's origin.

Example CORS configuration for the backend:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request

## License

[Specify your license here]