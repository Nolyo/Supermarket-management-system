// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';
export type SaveFile = 'get-save-file';
export type Reload = 'reload';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels | SaveFile | Reload, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(
      channel: Channels | SaveFile | Reload,
      func: (...args: unknown[]) => void,
    ) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(
      channel: Channels | SaveFile | Reload,
      func: (...args: unknown[]) => void,
    ) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
