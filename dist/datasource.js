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

          console.log(instanceSettings);
          this.type = instanceSettings.type;
          this.name = instanceSettings.name;
          this.quandl_api_key = instanceSettings.jsonData.quandl_api_key;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
        }

        _createClass(GenericDatasource, [{
          key: 'query',
          value: function query(options) {
            var _this = this;

            var start = options.range.from;
            var end = options.range.to;

            options.targets = options.targets.filter(function (t) {
              return !t.hide;
            });

            var proms = _.map(options.targets, function (target) {
              var tick = target.db + '/' + target.code;

              var url = 'https://www.quandl.com/api/v3/datasets/' + tick + '.json?';

              url = url + 'start_date=' + start.format('YYYY-MM-DD');
              url = url + '&end_date=' + end.format('YYYY-MM-DD');
              url = url + '&api_key=' + _this.quandl_api_key;

              return _this.backendSrv.datasourceRequest({
                url: url,
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
                  var datapoints = _.map(ts, function (tup) {
                    return [parseFloat(tup[1]), new Date(tup[0]).getTime()];
                  }).reverse();

                  var obj = {
                    target: tick,
                    datapoints: datapoints
                  };

                  return obj;
                }
                return null;
              });
            });
            return Promise.all(proms).then(function (data) {
              console.log(data);
              return { data: data };
            }).catch(function (err) {
              return console.log('Catch', err);
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
          key: 'annotationQuery',
          value: function annotationQuery(options) {
            return [{ annotation: options.annotation, "title": "Donlad trump is kinda funny", "time": 1450754160000, text: "teeext", tags: "taaags" }];
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(options) {
            var _this2 = this;

            var url = 'https://www.quandl.com/api/v3/databases/codes.json?';
            url = url + 'api_key=' + this.quandl_api_key;

            return this.backendSrv.datasourceRequest({
              url: url,
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            }).then(function (resp) {
              var codes = _.map(resp.data.databases, function (ds) {
                return { text: ds.name, value: ds.database_code };
              });
              var ret = _this2.mapToTextValue(codes);
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
