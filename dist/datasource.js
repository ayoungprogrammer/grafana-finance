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
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
        }

        _createClass(GenericDatasource, [{
          key: 'query',
          value: function query(options) {
            var query = this.buildQueryParameters(options);
            query.targets = query.targets.filter(function (t) {
              return !t.hide;
            });

            if (query.targets.length <= 0) {
              return this.q.when({ data: [] });
            }

            var start = options.range.from;
            var end = options.range.to;

            var resp = [];
            for (var target in query.targets) {
              var tick = target.target;
              resp[tick] = resp;

              var url = 'https://www.quandl.com/api/v3/datasets/' + tick;

              var quandl_resp = this.backendSrv.datasourceRequest({
                url: url,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
              });

              var ts = quandl_resp.dataset.data;
              var datapoints = _.map(ts, function (tup) {
                return [parseFloat(tup[1]), tup[0].getTime()];
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
            }).then(function (response) {});
          }
        }, {
          key: 'testDatasource',
          value: function testDatasource() {
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
        }, {
          key: 'annotationQuery',
          value: function annotationQuery(options) {
            return [{ annotation: options.annotation, "title": "Donlad trump is kinda funny", "time": 1450754160000, text: "teeext", tags: "taaags" }];
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(options) {
            return [];
          }
        }]);

        return GenericDatasource;
      }());

      _export('GenericDatasource', GenericDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
