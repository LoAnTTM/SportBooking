# Admin Dashboard for Club and Unit Management

This project is an admin dashboard designed to manage clubs and units effectively. It provides a user-friendly interface for administrators to create, edit, and view details of clubs and units.

## Project Structure

- **public/**: Contains static files such as the favicon and main HTML file.
- **src/**: Contains the source code for the application.
  - **assets/**: Contains images and logos used in the application.
  - **components/**: Contains reusable components for the application.
    - **common/**: Commonly used components like buttons, cards, loaders, and sidebars.
    - **clubs/**: Components specific to club management, including forms and lists.
    - **units/**: Components specific to unit management, including forms and lists.
  - **contexts/**: Contains context providers for managing global state.
  - **hooks/**: Custom hooks for reusable logic.
  - **layouts/**: Layout components for different sections of the application.
  - **pages/**: Contains the main pages of the application, organized by functionality.
  - **services/**: Contains API service functions for handling data requests.
  - **types/**: TypeScript types and interfaces for the application.
  - **utils/**: Utility functions for formatting and validation.
  - **App.tsx**: Main application component that sets up routing and context providers.
  - **main.tsx**: Entry point of the application that renders the App component.
  - **index.css**: Global styles for the application.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd admin-dashboard
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Features

- User authentication and authorization.
- Club management: Create, edit, and view clubs.
- Unit management: Create, edit, and view units.
- Responsive design for mobile and desktop views.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.