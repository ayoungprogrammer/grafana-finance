import _ from "lodash";

export class GenericDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
  }

  query(options) {
    var query = this.buildQueryParameters(options);
    query.targets = query.targets.filter(t => !t.hide);

    if (query.targets.length <= 0) {
      return this.q.when({data: []});
    }

    var start = options.range.from;
    var end = options.range.to;

    var resp = [];
    for(var target in query.targets){
        var tick = target.target;
        resp[tick] = resp;

        var url = 'https://www.quandl.com/api/v3/datasets/' + tick;

        var quandl_resp = this.backendSrv.datasourceRequest({
          url: url,
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        var ts = quandl_resp.dataset.data;
        var datapoints = _.map(ts, tup => {
            return [parseFloat(tup[1]), tup[0].getTime()]
        });

        var resp_obj = {};
        resp_obj.target = target;
        resp_obj.datapoints = datapoints;
        resp.push(resp_obj);
    }

    return this.backendSrv.datasourceRequest({
      url: url,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {

    });
  }

  testDatasource() {
    return { status: "success", message: "Data source is working", title: "Success" };
    // return this.backendSrv.datasourceRequest({
    //   url: this.url + '/',
    //   method: 'GET'
    // }).then(response => {
    //   if (response.status === 200) {
    //     return { status: "success", message: "Data source is working", title: "Success" };
    //   }
    // });
  }

  annotationQuery(options) {
    return [
        { annotation: options.annotation, "title": "Donlad trump is kinda funny", "time": 1450754160000, text: "teeext", tags: "taaags" },
    ]
  }

  metricFindQuery(options) {
    return [];
  }
}