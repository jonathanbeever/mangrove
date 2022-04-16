const {app, BrowserWindow, screen} = require('electron');

const createWindow = () => {
    const {
        width,
        height
    } = screen.getPrimaryDisplay().workAreaSize;

    const mainWindow = new BrowserWindow({
        width: width,
        height: height,
        show: false,
        autoHideMenuBar: true
    });

    mainWindow.loadURL('http://localhost');

    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.show();
        mainWindow.maximize();
    });
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // On macOS, it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
