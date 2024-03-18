/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import fs from 'fs';
import os from 'os';
import { app, BrowserWindow, shell, ipcMain, IpcMainEvent } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const appDataPath = process.env.APPDATA;
const appName = 'supermarket-management';

const logFilePath = path.join(
  appDataPath as string,
  appName,
  'logs',
  'log.log',
);
const logDir = path.join(appDataPath as string, appName, 'logs');

if (!fs.existsSync(logDir)) {
  log.info('Create logDir');
  fs.mkdirSync(logDir, { recursive: true });
}
log.transports.file.resolvePath = () => logFilePath;

class AppUpdater {
  constructor() {
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-downloaded', () => {
      console.log('test');
      autoUpdater.quitAndInstall(true, true);
    });
  }
}

let mainWindow: BrowserWindow | null = null;
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('ponggggg'));
});

ipcMain.on('log', async (event, arg) => {
  log.info(arg);
});

ipcMain.on('reload', async () => {
  mainWindow?.webContents.reload();
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
// const isDebug = true;
if (isDebug) {
  require('electron-debug')();
}

const reloadData = async (event: IpcMainEvent, filePath: string) => {
  try {
    log.info('Attempting to read the backup file');
    const data = fs.readFileSync(filePath, 'utf8');
    log.info(`Read file ${filePath} with size ${data.length} bytes`);

    // In es3 alphanumeric keys are not quoted, so we need to add quotes to them
    const correctedData = data.replace(/([{,]\s*)(\d+)(\s*:)/g, '$1"$2"$3');

    event.reply('get-save-file', correctedData);
  } catch (err) {
    log.error(err);
    event.reply('get-save-file', null);
  }
};

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    // width: 1024,
    // height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.maximize();
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  mainWindow.webContents.send('store-data', { store: 'main', data: 'data' });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

// let watcher: fs.FSWatcher | null = null;

/**
 * Add event listeners...
 */
// Get save File
ipcMain.on('get-save-file', async (event) => {
  const { username } = os.userInfo();
  const filePath = path.join(
    'C:',
    'Users',
    username,
    'AppData',
    'LocalLow',
    'Nokta Games',
    'Supermarket Simulator',
    'saveFile.es3',
  );
  reloadData(event, filePath);

  // if (!watcher) {
  //   watcher = fs.watch(filePath, (eventType, filename) => {
  //     if (eventType === 'change') {
  //       log.info(`the file ${filename} has been updated`);
  //       reloadData(event, filePath);
  //     }
  //   });
  // }
});

ipcMain.on('set-quantity', async (event, args) => {
  const outputPath = path.join(
    appDataPath as string,
    appName,
    'quantity_by_user.json',
  );
  try {
    fs.writeFileSync(outputPath, JSON.stringify(args, null, 2));
    event.reply('set-quantity', true);
  } catch (e: unknown) {
    event.reply('set-quantity', false);

    log.error(e);
  }
});

// Listen for 'get-quantity' event
ipcMain.on('get-quantity', async (event) => {
  log.info(`Starting read quantity_by_user file`);

  // Define the path for the user-specific file
  const filePath = path.join(
    appDataPath as string,
    appName,
    'quantity_by_user.json',
  );

  // Define the path for the default file
  const defaultFilePath = path.join(
    process.resourcesPath,
    'assets/quantity_by_user.json',
  );

  let data;
  try {
    // Check if the user-specific file exists
    if (!fs.existsSync(filePath)) {
      // If not, read the default file and write its content to the user-specific file
      data = fs.readFileSync(defaultFilePath, 'utf8');
      fs.writeFileSync(filePath, data);
      log.info(`Created file ${filePath} with size ${data.length} bytes`);
    } else {
      // If the user-specific file exists, read its content
      data = fs.readFileSync(filePath, 'utf8');
      log.info(`Read file ${filePath} with size ${data.length} bytes`);
    }

    // Send the content back to the renderer process
    event.reply('get-quantity', data);
  } catch (e: unknown) {
    // Log any error that occurs during the file operations
    log.error(e);
  }
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
