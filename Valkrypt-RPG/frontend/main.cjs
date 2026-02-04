const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // Esto permite que axios y otros servicios funcionen sin bloqueos de seguridad locales
      webSecurity: false 
    },
    backgroundColor: '#050505',
    icon: path.join(__dirname, 'public/favicon.ico') // Opcional: si tienes icono
  });

  // Determinamos la URL según el entorno
  const isDev = process.env.NODE_ENV === 'development';
  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : `file://${path.join(__dirname, 'dist/index.html')}`;

  win.loadURL(startUrl);

  // GESTIÓN DE ERRORES EN DESARROLLO: 
  // Si Vite aún no ha arrancado, reintenta cargar la URL cada 2 segundos
  if (isDev) {
    win.webContents.on('did-fail-load', () => {
      console.log("Esperando a que Vite arranque...");
      setTimeout(() => {
        win.loadURL(startUrl);
      }, 2000);
    });
    // Abre las herramientas de desarrollo automáticamente en modo dev
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});