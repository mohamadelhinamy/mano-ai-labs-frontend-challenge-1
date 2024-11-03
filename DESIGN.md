# DESIGN.md

### Key Features

- **Upload CSV File**: Users can upload CSV files containing claims data.
- **Claims Data Validation**: The CSV data is parsed and validated using Zod.
- **Approve Claims and Generate MRF**: Users can approve the claims to generate MRF files in JSON format.
- **MRF Listing**: A public page displays the list of all generated MRF files.
- **View File Details**: Users can click on an MRF file to view its contents.

## Project Structure

### Backend
- **Framework**: Hono is used for handling backend routes.
- **Endpoints**:
  - `/files/upload`: Accepts a CSV file upload, parses, and processes it.
  - `/files/generate-mrf`: Generates an MRF file from approved claims.
  - `/files/mrf-files`: Lists all generated MRF files.
  - `/files/mrf-files/:filename`: Fetches and displays details of a specific MRF file.

### Frontend
- **React Application**: Uses React for building UI components.
- **State Management**: MobX is used to manage the global state for handling claims and loading status.
- **Styling**: Utilizes Mantine for UI components and Tailwind CSS for custom styling.
- **Libraries**:
  - **AG Grid**: To display and manage claims data in a grid format.
  - **React Router**: For navigation between different pages, including upload, MRF listing, and file details pages.

### High-Level Flow
1. **File Upload**: Users upload a CSV file via the `UploadPage`. The file is parsed, and claims data is stored in the `claimsStore`.
2. **Approval and MRF Generation**: After uploading, users approve claims to trigger MRF generation. This data is then sent to the backend API to create the MRF file.
3. **List MRF Files**: Users can view a list of generated MRF files, and each file can be clicked to see its details.

## Running the App

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the app:
   ```sh
   npm run dev
   ```

### Viewing the Application
- Open your browser and navigate to `http://localhost:5173`.
- From here, you can upload CSV files, approve claims, generate MRF files, and view the list of generated MRF files.

### Notes
- **API Base URL**: Ensure the frontend's API base URL matches the backend server address by setting the `.env` file:
  ```
  VITE_API_BASE_URL=http://localhost:8080/api/
  ```
- **Generated MRF Files**: MRF files are stored in the backend in the `mrf_files` directory.

