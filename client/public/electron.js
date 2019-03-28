const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({minWidth: 800, minHeight: 600, webPreferences: {
        webSecurity: false
    }
  });
  mainWindow.maximize();
  mainWindow.loadURL(isDev ? 'http://localhost:3001' : `file://${path.join(__dirname, '../build/index.html')}`);

  mainWindow.on('closed', () => mainWindow = null);

  // Install React Dev Tools
  const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

  installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
      console.log(`Added Extension:  ${name}`);
  })
  .catch((err) => {
      console.log('An error occurred: ', err);
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
