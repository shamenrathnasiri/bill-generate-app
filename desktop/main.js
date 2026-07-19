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

function getPersistentDbDir() {
  // Keep the database outside the packaged app so updates do not replace it.
  return path.join(app.getPath('appData'), 'Bill Generate App', 'data');
}

function migrateExistingDatabase(targetDbDir, backendDir) {
  const targetDbPath = path.join(targetDbDir, 'abc bill db.db');

  // Candidate legacy locations to look for an existing DB
  const candidates = [];

  // Old userData location used by earlier app versions
  const legacyDbDir = path.join(app.getPath('userData'), 'data');
  candidates.push(path.join(legacyDbDir, 'abc bill db.db'));

  // Repository copy (when running unpackaged from source)
  candidates.push(path.join(__dirname, '..', 'bill-generate-backend', 'abc bill db.db'));

  // Dist folder produced by PyInstaller
  candidates.push(path.join(__dirname, '..', 'bill-generate-backend', 'dist', 'abc bill db.db'));

  // Backend directory (runtime location next to exe)
  if (backendDir) {
    candidates.push(path.join(backendDir, 'abc bill db.db'));
  }

  // Filter only existing candidate files
  const existing = candidates.filter((p) => fs.existsSync(p));
  if (existing.length === 0) {
    return;
  }

  // Choose the newest candidate by modification time
  let newest = existing[0];
  let newestMtime = fs.statSync(newest).mtimeMs;
  for (let i = 1; i < existing.length; i++) {
    try {
      const s = fs.statSync(existing[i]).mtimeMs;
      if (s > newestMtime) {
        newest = existing[i];
        newestMtime = s;
      }
    } catch (e) {
      // ignore stat failures
    }
  }

  // Ensure target dir exists
  fs.mkdirSync(targetDbDir, { recursive: true });

  // If target exists, only overwrite if candidate is newer
  if (fs.existsSync(targetDbPath)) {
    try {
      const targetMtime = fs.statSync(targetDbPath).mtimeMs;
      if (newestMtime <= targetMtime) {
        console.log('Existing persistent DB is newer or equal; no migration needed');
        return;
      }
    } catch (e) {
      // continue to copy if stat fails
    }
  }

  fs.copyFileSync(newest, targetDbPath);
  console.log('Migrated database from:', newest);
  console.log('Migrated database to:', targetDbPath);
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
    
    // Use a stable appData path for persistent database storage.
    // This keeps the database separate from the packaged app so updates do not remove it.
    const dbDir = getPersistentDbDir();
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    migrateExistingDatabase(dbDir, backendDir);
    console.log('Database directory:', dbDir);
    console.log('Database file will be at:', path.join(dbDir, 'abc bill db.db'));

    // Create environment with database directory path
    const backendEnv = { 
      ...process.env, 
      APP_DB_DIR: dbDir,
      // Also set these for Windows compatibility
      PYTHONIOENCODING: 'utf-8'
    };
    
    console.log('Passing APP_DB_DIR env:', dbDir);

    backendProcess = spawn(backendPath, [], {
      cwd: backendDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: backendEnv
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
