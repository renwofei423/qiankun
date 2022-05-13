"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMicroApps = registerMicroApps;
exports.loadMicroApp = loadMicroApp;
exports.start = start;
exports.frameworkConfiguration = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _noop2 = _interopRequireDefault(require("lodash/noop"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _tslib = require("tslib");

var _singleSpa = require("single-spa");

var _loader = require("./loader");

var _prefetch = require("./prefetch");

var _utils = require("./utils");

var microApps = []; // eslint-disable-next-line import/no-mutable-exports

var frameworkConfiguration = {};
exports.frameworkConfiguration = frameworkConfiguration;
var frameworkStartedDefer = new _utils.Deferred();

function registerMicroApps(apps, lifeCycles) {
  var _this = this;

  // Each app only needs to be registered once
  var unregisteredApps = apps.filter(function (app) {
    return !microApps.some(function (registeredApp) {
      return registeredApp.name === app.name;
    });
  });
  microApps = [].concat((0, _toConsumableArray2.default)(microApps), (0, _toConsumableArray2.default)(unregisteredApps));
  unregisteredApps.forEach(function (app) {
    var name = app.name,
        activeRule = app.activeRule,
        _app$loader = app.loader,
        loader = _app$loader === void 0 ? _noop2.default : _app$loader,
        props = app.props,
        appConfig = (0, _tslib.__rest)(app, ["name", "activeRule", "loader", "props"]);
    (0, _singleSpa.registerApplication)({
      name: name,
      app: function app() {
        return (0, _tslib.__awaiter)(_this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee3() {
          var _this2 = this;

          var _a, mount, otherMicroAppConfigs;

          return _regenerator.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  loader(true);
                  _context3.next = 3;
                  return frameworkStartedDefer.promise;

                case 3:
                  _context3.next = 5;
                  return (0, _loader.loadApp)(Object.assign({
                    name: name,
                    props: props
                  }, appConfig), frameworkConfiguration, lifeCycles);

                case 5:
                  _a = _context3.sent;
                  mount = _a.mount;
                  otherMicroAppConfigs = (0, _tslib.__rest)(_a, ["mount"]);
                  return _context3.abrupt("return", Object.assign({
                    mount: [function () {
                      return (0, _tslib.__awaiter)(_this2, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee() {
                        return _regenerator.default.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                return _context.abrupt("return", loader(true));

                              case 1:
                              case "end":
                                return _context.stop();
                            }
                          }
                        }, _callee);
                      }));
                    }].concat((0, _toConsumableArray2.default)((0, _utils.toArray)(mount)), [function () {
                      return (0, _tslib.__awaiter)(_this2, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee2() {
                        return _regenerator.default.wrap(function _callee2$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                return _context2.abrupt("return", loader(false));

                              case 1:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        }, _callee2);
                      }));
                    }])
                  }, otherMicroAppConfigs));

                case 9:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));
      },
      activeWhen: activeRule,
      customProps: props
    });
  });
}

function loadMicroApp(app, configuration, lifeCycles) {
  var props = app.props;
  return (0, _singleSpa.mountRootParcel)(function () {
    return (0, _loader.loadApp)(app, configuration !== null && configuration !== void 0 ? configuration : frameworkConfiguration, lifeCycles);
  }, Object.assign({
    domElement: document.createElement('div')
  }, props));
}

function start() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  exports.frameworkConfiguration = frameworkConfiguration = Object.assign({
    prefetch: true,
    singular: true,
    sandbox: true
  }, opts);
  var _frameworkConfigurati = frameworkConfiguration,
      prefetch = _frameworkConfigurati.prefetch,
      sandbox = _frameworkConfigurati.sandbox,
      singular = _frameworkConfigurati.singular,
      urlRerouteOnly = _frameworkConfigurati.urlRerouteOnly,
      importEntryOpts = (0, _tslib.__rest)(frameworkConfiguration, ["prefetch", "sandbox", "singular", "urlRerouteOnly"]);

  if (prefetch) {
    (0, _prefetch.doPrefetchStrategy)(microApps, prefetch, importEntryOpts);
  }

  if (sandbox) {
    if (!window.Proxy) {
      console.warn('[qiankun] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox'); // 快照沙箱不支持非 singular 模式

      if (!singular) {
        console.error('[qiankun] singular is forced to be true when sandbox enable but proxySandbox unavailable');
        frameworkConfiguration.singular = true;
      }
    }
  }

  (0, _singleSpa.start)({
    urlRerouteOnly: urlRerouteOnly
  });
  frameworkStartedDefer.resolve();
}