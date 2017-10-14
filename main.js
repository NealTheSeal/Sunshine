const {app, BrowserWindow} = require('electron');

const path = require('path');
const url = require('url');
const Store = require('./app/js/storage.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Instantiate the storage class
const storage = new Store({
    // name the file user-preferences
    configName: 'user-preferences',
    defaults: {
        windowBounds: { width: 560, height: 700 }
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {

  // retire preferencesStoraged data
  let { width, height } = storage.get('windowBounds');

  // Create the browser window.
  mainWindow = new BrowserWindow({width, height});

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

    // The BrowserWindow class extends the node.js core EventEmitter class, so we use that API
    // to listen to events on the BrowserWindow. The resize event is emitted when the window size changes
    mainWindow.on('resize', () => {
        // The event doesn't pass us the window size, so we call the getBounds method which returns an object with
        // the height, width, and x and y coordinates.
        let { width, height, x, y } = mainWindow.getBounds();
        
        // Now that we have them, save them using set method.
        storage.set('windowBounds', { width, height });
        storage.set('cordinates', { x, y });
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
