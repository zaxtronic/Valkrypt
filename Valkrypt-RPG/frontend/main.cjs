const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true, // Oculta la barra de herramientas para que parezca un juego
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false 
    },
    backgroundColor: '#050505',
    icon: path.join(__dirname, 'public/favicon.ico')
  });

  // USAR LAS VARIABLES DEL PLUGIN:
  // VITE_DEV_SERVER_URL la crea el plugin automáticamente al hacer
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Abre la consola automáticamente solo en desarrollo
    win.webContents.openDevTools();
  } else {
    // Para el ejecutable final (npm run electron:build)
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(createWindow);

// Cerrar procesos zombis al cerrar la ventana
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});