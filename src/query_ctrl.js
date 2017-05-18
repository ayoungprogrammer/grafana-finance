import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export class GenericDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector, uiSegmentSrv)  {
    super($scope, $injector);

    this.scope = $scope;
    this.uiSegmentSrv = uiSegmentSrv;
    console.log(this.target);
    this.target.key = this.target.key || '';
    this.target.target = this.target.target || 'LBMA/GOLD';
    this.target.db = this.target.target.split('/')[0] || 'LBMA';
    this.target.code = this.target.target.split('/')[1] || 'GOLD';
    this.onChangeInternal();
  }

  getOptions() {
    return this.datasource.metricFindQuery(this.target)
      .then(this.uiSegmentSrv.transformToSegments(false));
      // Options have to be transformed by uiSegmentSrv to be usable by metric-segment-model directive
  }

  getCodeOptions() {
    return Promise.all([])
  }

  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }

  onChangeInternal() {
    this.target.target = this.target.db + '/' + this.target.code;
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }
}

GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';