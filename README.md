# Angular Form Builder

A powerful and flexible form builder application built with Angular and Material Design. This application allows users to create, manage, fill out, and analyze forms with various field types and configurations.

## Features

### Form Creation and Editing

- **Dynamic Form Builder**: Create custom forms with a drag-and-drop interface
- **Multiple Field Types**:
  - Text fields
  - Number fields with validation
  - Date fields
  - Checkboxes
  - Select/Dropdown fields
  - Masked input fields (for formatted text like phone numbers, ZIP codes, etc.)
- **Field Configuration**:
  - Custom labels and placeholders
  - Required field validation
  - Field-specific settings (e.g., min/max for numbers, masks for formatted inputs)
  - Custom validation rules

### Form Filling

- User-friendly interface for form respondents
- Real-time validation
- Responsive design works on all devices
- Save partial responses
- Clear feedback on required fields and validation errors

### Response Management

- View all responses for each form
- Organize responses by submission date
- Filter and search through responses
- Individual response inspection

### Data Export

- Export form responses to CSV format
- CSV exports include:
  - All form fields as columns
  - One row per response
  - Properly formatted data
  - Handles special characters and comma-separated values

### Storage

- Forms and responses are stored locally using IndexedDB
- No server required - works completely in the browser
- Data persistence across sessions

## Technical Details

This project is built with:

- Angular (latest version)
- Angular Material for UI components
- IndexedDB for local storage
- TypeScript for type safety

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser to `http://localhost:4200`

## Usage

### Creating a Form

1. Navigate to the Form Editor
2. Add fields using the "Add Field" button
3. Configure each field's properties
4. Save the form

### Filling Out Forms

1. Select a form from the home page
2. Fill in the required fields
3. Submit the form

### Viewing Responses

1. Navigate to the form's responses page
2. View all submissions
3. Export to CSV if needed

### Exporting Data

1. Go to the responses view for a form
2. Click the export button to download responses as CSV
3. Open the CSV file in your preferred spreadsheet software

## Development

The project follows Angular best practices and uses a modular architecture:

- Components for UI elements
- Services for business logic and data management
- Models for type definitions
- Material Design for consistent styling

## License

This project is open source and available under the MIT License.
