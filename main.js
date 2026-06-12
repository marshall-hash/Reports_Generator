const { app, BrowserWindow } = require('electron');
const path = require('path');

const { spawn } = require('child_process');

app.setPath('userData', path.join(app.getPath('appData'), 'reports-generator'));
app.commandLine.appendSwitch('disable-gpu');
let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900
  });
  
  win.loadFile(
    path.join(__dirname, 'frontend', 'dist', 'index.html')
  );
 
}

app.whenReady().then(() => {

  backendProcess = spawn(
    'node',
    [path.join(__dirname, 'backend', 'index.js')],
    {
      stdio: 'inherit'
    }
  );

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