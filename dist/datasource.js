'use strict';

System.register(['lodash'], function (_export, _context) {
  "use strict";

  var _, _createClass, GenericDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('GenericDatasource', GenericDatasource = function () {
        function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, GenericDatasource);

          this.type = instanceSettings.type;
          this.name = instanceSettings.name;
          this.quandl_api_key = instanceSettings.jsonData.quandl_api_key;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
        }

        _createClass(GenericDatasource, [{
          key: 'delay',
          value: function delay(t) {
            return new Promise(function (resolve) {
              setTimeout(resolve, t);
            });
          }
        }, {
          key: 'getTimeSeries',
          value: function getTimeSeries(options, retryInterval) {
            var _this = this;

            return this.backendSrv.datasourceRequest({
              url: options.url,
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
              }
            }).then(function (resp) {
              if (resp.status === 200) {
                var ts = resp.data.dataset.data;
                var ind = resp.data.dataset.column_names.indexOf(options.key);
                if (ind == -1) {
                  ind = 1;
                }

                var datapoints = _.map(ts, function (tup) {
                  return [parseFloat(tup[ind]), new Date(tup[0]).getTime()];
                }).reverse();

                var obj = {
                  target: options.tick,
                  datapoints: datapoints
                };

                return obj;
              }
              return null;
            }).catch(function (err) {
              if (err.status == 404 || retryInterval > 10000) {
                var errors = {
                  message: "Error getting time series"
                };
                if (err.data && err.data.quandl_error) {
                  errors = {
                    message: err.data.quandl_error.message
                  };
                } else if (retryInterval > 10000) {
                  var errors = {
                    message: "Request timed out"
                  };
                }
                return _this.q.reject(errors);
              }

              var that = _this;
              return _this.delay(retryInterval).then(function () {
                return that.getTimeSeries(options, retryInterval * 2);
              });
            });
          }
        }, {
          key: 'query',
          value: function query(options) {
            var _this2 = this;

            var start = options.range.from;
            var end = options.range.to;

            options.targets = options.targets.filter(function (t) {
              return !t.hide;
            });

            var proms = _.map(options.targets, function (target) {
              var tick = target.db + '/' + target.code;

              var url = 'https://www.quandl.com/api/v3/datasets/' + tick + '.json?';
              var key = target.key;

              url = url + 'start_date=' + start.format('YYYY-MM-DD');
              url = url + '&end_date=' + end.format('YYYY-MM-DD');
              url = url + '&api_key=' + _this2.quandl_api_key;

              return _this2.getTimeSeries({ url: url, tick: tick, key: key }, 500);
            });
            return Promise.all(proms).then(function (data) {
              return { data: data };
            });
          }
        }, {
          key: 'testDatasource',
          value: function testDatasource() {
            var url = 'https://www.quandl.com/api/v3/databases/codes.json?';
            url = url + 'api_key=' + this.quandl_api_key;

            return this.backendSrv.datasourceRequest({
              url: url,
              method: 'GET'
            }).then(function (response) {
              if (response.status === 200) {
                return { status: "success", message: "Data source is working", title: "Success" };
              }
            });
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(options) {
            var _this3 = this;

            var url = 'https://www.quandl.com/api/v3/databases/codes.json?';
            url = url + 'api_key=' + this.quandl_api_key;

            return this.backendSrv.datasourceRequest({
              url: url,
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            }).then(function (resp) {
              var codes = _.map(resp.data.databases, function (ds) {
                return { text: ds.database_code, value: ds.database_code };
              });
              var ret = _this3.mapToTextValue(codes);
              return ret;
            });
          }
        }, {
          key: 'mapToTextValue',
          value: function mapToTextValue(result) {
            return _.map(result, function (d, i) {
              if (d && d.text && d.value) {
                return { text: d.text, value: d.value };
              } else if (_.isObject(d)) {
                return { text: d, value: i };
              }
              return { text: d, value: d };
            });
          }
        }]);

        return GenericDatasource;
      }());

      _export('GenericDatasource', GenericDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
