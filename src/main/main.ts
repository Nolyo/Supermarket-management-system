/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, shell, ipcMain, IpcMainEvent } from 'electron';
import { autoUpdater } from 'electron-updater';
import chokidar from 'chokidar';
import log from 'electron-log';
import path from 'path';
import fs from 'fs';
import os from 'os';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const appInsights = require('applicationinsights');

appInsights.setup('d44ad9ee-8872-49df-b039-722ce6bc15ac').start();
appInsights.defaultClient.trackEvent({
  name: 'Started app',
  properties: {
    version: '1.5.4',
    platform: process.platform,
    arch: process.arch,
  },
});

const appDataPath = process.env.APPDATA;
const appName = 'supermarket-management';

const settingsPath = path.join(appDataPath as string, appName, 'settings.json');
let isQuitting = false;

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

let settings: { x: number; y: number; width: number; height: number } = {
  x: 0,
  y: 0,
  width: 1024,
  height: 728,
};

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
if (isDebug) {
  require('electron-debug')();
}

const reloadData = async (
  event: IpcMainEvent,
  filePath: string,
  isErrorHasReload = false,
) => {
  try {
    log.info('Attempting to read the backup file');
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    let data = '';
    stream.on('data', (chunk) => {
      data += chunk;
    });
    stream.on('end', () => {
      log.info(`Read file ${filePath} with size ${data.length} bytes`);
      const correctedData = data.replace(/([{,]\s*)(\d+)(\s*:)/g, '$1"$2"$3');
      event.reply('get-save-file', correctedData);
    });
    stream.on('error', (err) => {
      if (!isErrorHasReload) {
        appInsights.defaultClient.trackException({ exception: err });
        log.error(err);
      }
      setTimeout(() => {
        reloadData(event, filePath, true);
      }, 1200);
    });
  } catch (err) {
    log.error(err);
    setTimeout(() => {
      reloadData(event, filePath, true);
    }, 2000);
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

  try {
    const settingsFile = fs.readFileSync(settingsPath, 'utf8');
    settings = JSON.parse(settingsFile);
  } catch (error) {
    log.info('No settings file found');
  }

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    x: settings.x || 0,
    y: settings.y || 0,
    show: false,
    width: settings.width || 800,
    height: settings.height || 600,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.on('move', () => {
    if (mainWindow) {
      const { x, y } = mainWindow.getBounds();
      settings.x = x;
      settings.y = y;
    }
  });

  mainWindow.on('resize', () => {
    if (mainWindow) {
      const { width, height } = mainWindow.getBounds();
      settings.width = width;
      settings.height = height;
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      // mainWindow.maximize();
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

  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
// Get save File
const watchSaveFile = (event: IpcMainEvent, filePath: string) => {
  const watcher = chokidar.watch(filePath);
  watcher.on('change', () => {
    log.info(`the file ${filePath} has been updated`);
    reloadData(event, filePath);
  });
  watcher.on('error', (err) => {
    log.error(`Error watching file ${filePath}:`, err);
  });
};

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
  watchSaveFile(event, filePath);
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
    appInsights.defaultClient.trackException({ exception: e });
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
    appInsights.defaultClient.trackException({ exception: e });
  }
});

app.on('before-quit', (event) => {
  if (!isQuitting) {
    event.preventDefault();
    try {
      fs.writeFileSync(
        path.join(appDataPath as string, appName, 'settings.json'),
        JSON.stringify(settings),
      );
      isQuitting = true;
      app.quit();
    } catch (e) {
      log.error(e);
      appInsights.defaultClient.trackException({ exception: e });
    }
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
