const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    // Установи 1000 и 1000 для квадрата 
    // Или width: 1920, height: 1080 для Full HD
    width: 1000, 
    height: 1000, 
    
    resizable: false,      // Запрещает пользователю менять размер окна
    fullscreenable: false, // Запрещает разворачивать на весь экран
    autoHideMenuBar: true, // Скрывает верхнее меню (File, Edit и т.д.)
    
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
  
  // Если хочешь убрать рамки Windows (сделать чистое окно), 
  // можно добавить параметр frame: false, но тогда не будет кнопок закрытия.
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});