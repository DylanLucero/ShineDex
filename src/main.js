const {app, BrowserWindow, Menu} = require("electron");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: 'src/assets/img/icon.icns',
    })
    win.loadFile('src/index.html')
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.disableHardwareAcceleration()