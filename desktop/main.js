const { app, BrowserWindow, protocol, net } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const url = require('url');
const http = require('http');

let mainWindow;
let backendProcess;

// Determine if we're in development or production
const isDev = !app.isPackaged;

// Get paths based on environment
function getBackendPath() {
  if (isDev) {
    // Development: use the PyInstaller exe from backend dist folder
    return path.join(__dirname, '..', 'bill-generate-backend', 'dist', 'app.exe');
  } else {
    // Production: use the bundled exe in resources
    return path.join(process.resourcesPath, 'backend', 'app.exe');
  }
}

function getFrontendPath() {
  if (isDev) {
    // Development: use the built frontend
    return path.join(__dirname, '..', 'bill-generate-frontend', 'dist');
  } else {
    // Production: use the bundled frontend in resources
    return path.join(process.resourcesPath, 'frontend');
  }
}

// Start the Flask backend
function startBackend() {
  return new Promise((resolve, reject) => {
    const backendPath = getBackendPath();
    
    console.log('Starting backend from:', backendPath);
    
    // Check if backend executable exists
    if (!fs.existsSync(backendPath)) {
      console.error('Backend executable not found at:', backendPath);
      reject(new Error('Backend executable not found'));
      return;
    }

    // Set working directory to backend location for database access
    const backendDir = path.dirname(backendPath);
    
    // Use Electron's userData directory for persistent database storage
    // This ensures the database survives app updates and restarts
    const dbDir = path.join(app.getPath('userData'), 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    console.log('Database directory:', dbDir);

    backendProcess = spawn(backendPath, [], {
      cwd: backendDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, APP_DB_DIR: dbDir }
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
      // Check if Flask has started
      if (data.toString().includes('Running on')) {
        resolve();
      }
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
      // Flask also outputs to stderr when starting
      if (data.toString().includes('Running on')) {
        resolve();
      }
    });

    backendProcess.on('error', (err) => {
      console.error('Failed to start backend:', err);
      reject(err);
    });

    backendProcess.on('close', (code) => {
      console.log(`Backend process exited with code ${code}`);
    });

    // Poll the backend until it responds (max ~15 seconds)
    const maxAttempts = 30;
    let attempts = 0;
    const checkBackend = () => {
      attempts++;
      const req = http.get('http://localhost:5000/api/dashboard', (res) => {
        console.log('Backend is ready (status ' + res.statusCode + ')');
        resolve();
      });
      req.on('error', () => {
        if (attempts < maxAttempts) {
          setTimeout(checkBackend, 500);
        } else {
          console.warn('Backend did not respond in time, proceeding anyway');
          resolve();
        }
      });
      req.setTimeout(2000, () => { req.destroy(); });
    };

    // Give the process a moment to start before polling
    setTimeout(checkBackend, 1000);
  });
}

// Stop the Flask backend
function stopBackend() {
  if (backendProcess) {
    console.log('Stopping backend...');
    
    // On Windows, we need to kill the process tree
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', backendProcess.pid, '/f', '/t']);
    } else {
      backendProcess.kill('SIGTERM');
    }
    
    backendProcess = null;
  }
}

// Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Allow loading local resources
    },
    icon: path.join(__dirname, 'icon.ico'),
    autoHideMenuBar: true,
    show: false,
    title: 'Bill Generate App'
  });

  // Load the frontend
  const frontendPath = getFrontendPath();
  const indexPath = path.join(frontendPath, 'index.html');
  
  console.log('Loading frontend from:', indexPath);
  
  if (fs.existsSync(indexPath)) {
    // Use file:// protocol with proper URL encoding
    mainWindow.loadFile(indexPath);
  } else {
    console.error('Frontend not found at:', indexPath);
    mainWindow.loadURL(`data:text/html,
      <html>
        <body style="font-family: Arial; padding: 50px; text-align: center;">
          <h1>Frontend Not Found</h1>
          <p>Please build the frontend first:</p>
          <code>cd bill-generate-frontend && npm run build</code>
        </body>
      </html>
    `);
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle events
app.whenReady().then(async () => {
  try {
    // Start backend first
    await startBackend();
    console.log('Backend started successfully');
    
    // Then create window
    createWindow();
  } catch (err) {
    console.error('Failed to start application:', err);
    // Still create window to show error
    createWindow();
  }
});

app.on('window-all-closed', () => {
  stopBackend();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopBackend();
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  stopBackend();
});
