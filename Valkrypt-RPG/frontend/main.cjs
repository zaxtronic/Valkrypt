const { app, BrowserWindow } = require('electron');
const path = require('path');
const dotenv = require('dotenv');

// 1. DETECCIÓN DE ENTORNO
const isDev = !!process.env.VITE_DEV_SERVER_URL;
const rootPath = isDev ? __dirname : app.getAppPath();

// 2. CONFIGURACIÓN DE VARIABLES DE ENTORNO (.env)
// Forzamos la ruta al .env para que MongoDB Atlas reciba la MONGO_URI correctamente
const envPath = isDev 
  ? path.join(__dirname, '..', 'backend', '.env') 
  : path.join(process.resourcesPath, 'backend', '.env');

dotenv.config({ path: envPath });

// 3. CARGA DEL SERVIDOR BACKEND
// Usamos '..' en Dev porque main.cjs está en /frontend y server en /backend
const backendPath = isDev 
  ? path.join(__dirname, '..', 'backend', 'server.js') 
  : path.join(process.resourcesPath, 'backend', 'server.js');

try {
  console.log(`🛡️ Valkrypt Engine: Cargando desde ${backendPath}`);
  require(backendPath);
} catch (err) {
  console.error('❌ Error crítico al arrancar el servidor interno:', err.message);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Mantener según tu código original
      webSecurity: false       // Mantener según tu código original
    },
    backgroundColor: '#050505',
    // Ruta del icono adaptable
    icon: path.join(__dirname, isDev ? 'public' : 'dist', 'favicon.ico')
  });

  // 4. CARGA DEL FRONTEND
  if (isDev) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    // En el ejecutable, cargamos el index.html compilado por Vite
    win.loadFile(path.join(__dirname, 'dist/index.html')).catch(err => {
      console.error("Fallo al cargar el frontend:", err);
    });
  }
}

// 5. EVENTOS DE LA APLICACIÓN
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});