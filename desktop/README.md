# Bill Generate Desktop Application

This is an Electron-based desktop application that runs offline without requiring internet connection.

## Project Structure

- `bill-generate-frontend/` - React frontend built with Vite
- `bill-generate-backend/` - Flask backend with SQLite database
- `desktop/` - Electron wrapper to create desktop app

## Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **Python** (3.8 or higher) - [Download](https://python.org/)
3. **pip** (comes with Python)

## Development Setup

### 1. Setup Backend

```bash
cd bill-generate-backend
pip install -r requirements.txt
python app.py
```

### 2. Setup Frontend

```bash
cd bill-generate-frontend
npm install
npm run dev
```

### 3. Run Electron (Development)

First, build the frontend and backend:

```bash
# Build frontend
cd bill-generate-frontend
npm run build

# Build backend executable
cd ../bill-generate-backend
pip install pyinstaller
pyinstaller --onefile app.py

# Run Electron
cd ../desktop
npm install
npm start
```

## Building for Production

### Automated Build (Windows)

Simply run the build script:

```bash
cd desktop
build.bat
```

### Manual Build

1. **Build Frontend:**
   ```bash
   cd bill-generate-frontend
   npm install
   npm run build
   ```

2. **Build Backend:**
   ```bash
   cd bill-generate-backend
   pip install pyinstaller
   pyinstaller --onefile --noconsole app.py
   ```

3. **Build Electron Installer:**
   ```bash
   cd desktop
   npm install
   npm run build:win
   ```

The installer will be created in `desktop/dist/`.

## How It Works

1. **Electron** starts and launches the Flask backend as a child process
2. The Flask backend runs on `localhost:5000` and handles all API requests
3. The React frontend is served from local files
4. **SQLite database** is stored locally for offline data persistence
5. No internet connection required!

## Troubleshooting

### Backend not starting
- Make sure the backend executable exists at `bill-generate-backend/dist/app.exe`
- Check if port 5000 is available

### Frontend not loading
- Make sure the frontend is built: `cd bill-generate-frontend && npm run build`
- Check that `bill-generate-frontend/dist/index.html` exists

### Database issues
- The SQLite database file `abc bill db.db` is created automatically
- It's stored in the same directory as the backend executable
