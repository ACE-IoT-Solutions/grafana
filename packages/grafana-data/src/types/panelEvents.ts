import { eventFactory } from './utils';
import { DataQueryError, DataQueryResponseData } from './datasource';
import { AngularPanelMenuItem } from './panel';

/** Payloads */
export interface MenuElement {
  text: string;
  click: string;
  role?: string;
  shortcut?: string;
}

/** Legacy Events */
export interface PanelChangeViewPayload {
  fullscreen?: boolean;
  edit?: boolean;
  panelId?: number;
  toggle?: boolean;
}

/** Events */
export const refresh = eventFactory('refresh');
export const componentDidMount = eventFactory('component-did-mount');
export const dataError = eventFactory<DataQueryError>('data-error');
export const dataReceived = eventFactory<DataQueryResponseData[]>('data-received');
export const dataSnapshotLoad = eventFactory<DataQueryResponseData[]>('data-snapshot-load');
export const editModeInitialized = eventFactory('init-edit-mode');
export const initPanelActions = eventFactory<AngularPanelMenuItem[]>('init-panel-actions');
export const panelChangeView = eventFactory<PanelChangeViewPayload>('panel-change-view');
export const panelInitialized = eventFactory('panel-initialized');
export const panelSizeChanged = eventFactory('panel-size-changed');
export const panelTeardown = eventFactory('panel-teardown');
export const render = eventFactory<any>('render');
