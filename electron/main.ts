import { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { readJSON, writeJSON } from './storage.js';
import { createGameStateService } from './gameStateService.js';
import { getOverlayUrl, shouldHideManagementWindow } from './windowLifecycle.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let petWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;
let gameStateService: ReturnType<typeof createGameStateService> | null = null;

const isDev = process.argv.includes('--dev');
const VITE_DEV_URL = 'http://localhost:3000';

function createManagementWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: '数码世界 - 宠物管理',
    icon: path.join(__dirname, '../public/favicon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL(`${VITE_DEV_URL}#/`);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: '/' });
  }

  mainWindow.on('close', (event) => {
    if (shouldHideManagementWindow(isQuitting)) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
}

function showManagementWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createManagementWindow();
    return;
  }
  mainWindow.show();
  mainWindow.focus();
}

function createPetOverlay() {
  const displays = screen.getAllDisplays();
  const primary = screen.getPrimaryDisplay();
  const { width, height } = primary.workAreaSize;

  petWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 点击穿透（让鼠标事件穿透透明区域到桌面）
  petWindow.setIgnoreMouseEvents(true, { forward: true });

  if (isDev) {
    petWindow.loadURL(getOverlayUrl(VITE_DEV_URL));
  } else {
    petWindow.loadFile(path.join(__dirname, '../dist/pet-overlay.html'));
  }

  // 鼠标移到宠物上时才捕获事件
  petWindow.webContents.on('ipc-message', (_event, channel) => {
    if (channel === 'pet-hover') {
      petWindow?.setIgnoreMouseEvents(false);
    } else if (channel === 'pet-leave') {
      petWindow?.setIgnoreMouseEvents(true, { forward: true });
    }
  });

  petWindow.on('closed', () => {
    petWindow = null;
  });
}

function createTray() {
  // 创建一个简单的 tray 图标
  const iconSize = 16;
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: '📖 打开管理', click: () => showManagementWindow() },
    { type: 'separator' },
    {
      label: '🎮 互动',
      submenu: [
        { label: '🍖 喂食', click: () => petWindow?.webContents.send('pet-interact', 'feed') },
        { label: '👋 抚摸', click: () => petWindow?.webContents.send('pet-interact', 'pet') },
        { label: '🧼 洗澡', click: () => petWindow?.webContents.send('pet-interact', 'wash') },
        { label: '🎾 玩耍', click: () => petWindow?.webContents.send('pet-interact', 'play') },
      ],
    },
    { type: 'separator' },
    { label: '🚪 退出', click: () => app.quit() },
  ]);

  tray.setToolTip('🐾 数码世界');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => showManagementWindow());
}

// ====== IPC Handlers ======

// 数据持久化
ipcMain.handle('storage:read', (_event, filename: string, defaultValue: any) => {
  return readJSON(filename, defaultValue);
});

ipcMain.handle('storage:write', (_event, filename: string, data: any) => {
  writeJSON(filename, data);
  return true;
});

ipcMain.handle('game:read', () => gameStateService?.snapshot());

ipcMain.handle('game:dispatch', (_event, action: any) => {
  return gameStateService?.dispatch(action);
});

ipcMain.handle('game:replace', (_event, state: unknown) => {
  return gameStateService?.replace(state);
});

ipcMain.handle('window:open-management', () => {
  showManagementWindow();
  return true;
});

// 获取屏幕信息
ipcMain.handle('screen:info', () => {
  const primary = screen.getPrimaryDisplay();
  return {
    width: primary.workAreaSize.width,
    height: primary.workAreaSize.height,
  };
});

// 切换鼠标穿透
ipcMain.on('pet:ignore-mouse', (_event, ignore: boolean) => {
  if (petWindow) {
    petWindow.setIgnoreMouseEvents(ignore, { forward: true });
  }
});

// ====== App Lifecycle ======

app.whenReady().then(() => {
  gameStateService = createGameStateService({
    read: () => readJSON('game-state.json', undefined),
    write: (state) => writeJSON('game-state.json', state),
    publish: (state) => {
      for (const window of [mainWindow, petWindow]) {
        if (window && !window.isDestroyed()) {
          window.webContents.send('game:state', state);
        }
      }
    },
  });
  createPetOverlay();
  createTray();

  app.on('activate', () => {
    showManagementWindow();
  });
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
