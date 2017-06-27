import _ from "lodash";

export class GenericDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.name = instanceSettings.name;
    this.quandl_api_key = instanceSettings.jsonData.quandl_api_key;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
  }

  delay(t) {
    return new Promise(function(resolve) { 
      setTimeout(resolve, t)
    });
  }

  getTimeSeries(options, retryInterval) {
    return this.backendSrv.datasourceRequest({
      url: options.url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      }
    }).then(resp => {
      if (resp.status === 200) {
        var ts = resp.data.dataset.data;
        var ind = resp.data.dataset.column_names.indexOf(options.key);
        if(ind == -1){
          ind = 1;
        }

        var datapoints = _.map(ts, tup => {
            return [parseFloat(tup[ind]), new Date(tup[0]).getTime()]
        }).reverse();

        var obj = {
            target: options.tick,
            datapoints: datapoints
        }

        return obj;
      }
      return null;
    }).catch(err => {
        if(err.status == 404 || retryInterval > 10000){
          var errors = {
            message: "Error getting time series"
          }
          if(err.data && err.data.quandl_error){
            errors = {
              message: err.data.quandl_error.message
            };
          }
          else if(retryInterval > 10000){
            var errors = {
              message: "Request timed out"
            }
          }
          return this.q.reject(errors);
        }

        var that = this;
        return this.delay(retryInterval).then(function(){
            return that.getTimeSeries(options, retryInterval * 2);
        })
    });
  }

  query(options) {
    var start = options.range.from;
    var end = options.range.to;

    options.targets = options.targets.filter(t => !t.hide);

    var proms = _.map(options.targets, target => {
        var tick = target.db + '/' + target.code;

        var url = 'https://www.quandl.com/api/v3/datasets/' + tick + '.json?';
        var key = target.key;

        url = url + 'start_date=' + start.format('YYYY-MM-DD');
        url = url + '&end_date=' + end.format('YYYY-MM-DD');
        url = url + '&api_key=' + this.quandl_api_key;

        return this.getTimeSeries({url: url, tick: tick, key: key}, 500);
    });
    return Promise.all(proms)
        .then(data => {
            return {data: data}
        })
  }


  testDatasource() {
    var url = 'https://www.quandl.com/api/v3/databases/codes.json?'
    url = url + 'api_key=' + this.quandl_api_key;

    return this.backendSrv.datasourceRequest({
      url: url,
      method: 'GET'
    }).then(response => {
      if (response.status === 200) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
    });
  }

  metricFindQuery(options) {

    var url = 'https://www.quandl.com/api/v3/databases/codes.json?'
    url = url + 'api_key=' + this.quandl_api_key;

    return this.backendSrv.datasourceRequest({
      url: url,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(resp => {
        var codes = _.map(resp.data.databases, ds => {
            return {text: ds.database_code, value: ds.database_code};
        });
        var ret = this.mapToTextValue(codes);
        return ret;
    });
  }

  mapToTextValue(result) {
    return _.map(result, (d, i) => {
      if (d && d.text && d.value) {
        return { text: d.text, value: d.value };
      } else if (_.isObject(d)) {
        return { text: d, value: i};
      }
      return { text: d, value: d };
    });
  }
}
