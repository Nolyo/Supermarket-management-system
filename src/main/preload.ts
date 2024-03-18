// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';
export type SaveFile = 'get-save-file';
export type Reload = 'reload';
export type Log = 'log';
export type SetQuantity = 'set-quantity';
export type GetQuantity = 'get-quantity';

type Msg = Channels | SaveFile | Reload | Log | SetQuantity | GetQuantity;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Msg, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Msg, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Msg, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
