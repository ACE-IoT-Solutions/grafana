import _ from 'lodash';
import config from 'app/core/config';
import { profiler } from 'app/core/core';
import { Emitter } from 'app/core/utils/emitter';
import { auto } from 'angular';
import { TemplateSrv } from '../templating/template_srv';
import { getPanelLinksSupplier } from './panellinks/linkSuppliers';
import { AppEvent, PanelEvents, PanelPluginMeta, renderMarkdown, AngularPanelMenuItem } from '@grafana/data';
import { getLocationSrv } from '@grafana/runtime';
import { CoreEvents } from 'app/types';
import { DashboardModel } from '../dashboard/state';

export class PanelCtrl {
  panel: any;
  error: any;
  dashboard: DashboardModel;
  pluginName: string;
  pluginId: string;
  editorTabs: any;
  $scope: any;
  $injector: auto.IInjectorService;
  $location: any;
  $timeout: any;
  editModeInitiated: boolean;
  height: number;
  width: number;
  containerHeight: any;
  events: Emitter;
  loading: boolean;
  timing: any;

  constructor($scope: any, $injector: auto.IInjectorService) {
    this.$injector = $injector;
    this.$location = $injector.get('$location');
    this.$scope = $scope;
    this.$timeout = $injector.get('$timeout');
    this.editorTabs = [];
    this.events = this.panel.events;
    this.timing = {}; // not used but here to not break plugins

    const plugin = config.panels[this.panel.type];
    if (plugin) {
      this.pluginId = plugin.id;
      this.pluginName = plugin.name;
    }

    $scope.$on(PanelEvents.componentDidMount.name, () => this.panelDidMount());
  }

  panelDidMount() {
    this.events.emit(PanelEvents.componentDidMount);
    this.dashboard.panelInitialized(this.panel);
  }

  renderingCompleted() {
    profiler.renderingCompleted();
  }

  refresh() {
    this.panel.refresh();
  }

  publishAppEvent<T>(event: AppEvent<T>, payload?: T) {
    this.$scope.$root.appEvent(event, payload);
  }

  changeView(fullscreen: boolean, edit: boolean) {
    this.publishAppEvent(CoreEvents.panelChangeView, {
      fullscreen,
      edit,
      panelId: this.panel.id,
    });
  }

  viewPanel() {
    this.changeView(true, false);
  }

  editPanel() {
    this.changeView(true, true);
  }

  exitFullscreen() {
    this.changeView(false, false);
  }

  initEditMode() {
    if (!this.editModeInitiated) {
      this.editModeInitiated = true;
      this.events.emit(PanelEvents.editModeInitialized);
    }
  }

  addEditorTab(title: string, directiveFn: any, index?: number, icon?: any) {
    const editorTab = { title, directiveFn, icon };

    if (_.isString(directiveFn)) {
      editorTab.directiveFn = () => {
        return { templateUrl: directiveFn };
      };
    }

    if (index) {
      this.editorTabs.splice(index, 0, editorTab);
    } else {
      this.editorTabs.push(editorTab);
    }
  }

  getExtendedMenu() {
    const menu: AngularPanelMenuItem[] = [];
    this.events.emit(PanelEvents.initPanelActions, menu);
    return menu;
  }

  // Override in sub-class to add items before extended menu
  async getAdditionalMenuItems(): Promise<any[]> {
    return [];
  }

  otherPanelInFullscreenMode() {
    return this.dashboard.meta.fullscreen && !this.panel.fullscreen;
  }

  render(payload?: any) {
    this.events.emit(PanelEvents.render, payload);
  }

  // overriden from react
  onPluginTypeChange = (plugin: PanelPluginMeta) => {};
}
