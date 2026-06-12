const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

app.setPath(
  'userData',
  path.join(app.getPath('appData'), 'reports-generator')
);

app.commandLine.appendSwitch('disable-gpu');

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
     icon: path.join(__dirname, 'build', 'high.ico')
  });

  win.loadFile(
    path.join(__dirname, 'frontend', 'dist', 'index.html')
  );
}

app.whenReady().then(() => {

 const backendPath = app.isPackaged
  ? path.join(process.resourcesPath, "app.asar.unpacked", "backend", "index.js")
  : path.join(__dirname, "backend", "index.js");

  backendProcess = fork(backendPath, [], {
  silent: false,
  cwd: path.dirname(backendPath)
});


  setTimeout(() => {
    createWindow();
  }, 3000);

});

app.on('window-all-closed', () => {

  if (backendProcess) {
    backendProcess.kill();
  }

  app.quit();
});