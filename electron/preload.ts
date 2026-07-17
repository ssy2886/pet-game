import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // 数据存储
  storageRead: (filename: string, defaultValue?: any) =>
    ipcRenderer.invoke('storage:read', filename, defaultValue),
  storageWrite: (filename: string, data: any) =>
    ipcRenderer.invoke('storage:write', filename, data),

  gameRead: () => ipcRenderer.invoke('game:read'),
  gameDispatch: (action: unknown) => ipcRenderer.invoke('game:dispatch', action),
  gameReplace: (state: unknown) => ipcRenderer.invoke('game:replace', state),
  onGameState: (callback: (state: unknown) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, state: unknown) => callback(state)
    ipcRenderer.on('game:state', listener)
    return () => ipcRenderer.removeListener('game:state', listener)
  },
  openManagement: () => ipcRenderer.invoke('window:open-management'),

  // 屏幕信息
  getScreenInfo: () => ipcRenderer.invoke('screen:info'),

  // 鼠标穿透控制
  ignoreMouse: (ignore: boolean) => ipcRenderer.send('pet:ignore-mouse', ignore),

  // 互动事件
  onInteract: (callback: (action: string) => void) => {
    ipcRenderer.on('pet-interact', (_event, action) => callback(action));
  },

  // 平台信息
  platform: process.platform,
});
