"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchAtMounting = patchAtMounting;
exports.patchAtBootstrapping = patchAtBootstrapping;
exports.css = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _interfaces = require("../../interfaces");

var _dynamicAppend = _interopRequireDefault(require("./dynamicAppend"));

var _historyListener = _interopRequireDefault(require("./historyListener"));

var _interval = _interopRequireDefault(require("./interval"));

var _windowListener = _interopRequireDefault(require("./windowListener"));

var css = _interopRequireWildcard(require("./css"));

exports.css = css;

/**
 * @author Kuitos
 * @since 2019-04-11
 */
function patchAtMounting(appName, elementGetter, sandbox, singular, scopedCSS, excludeAssetFilter) {
  var _patchersInSandbox;

  var _a;

  var basePatchers = [function () {
    return (0, _interval.default)(sandbox.proxy);
  }, function () {
    return (0, _windowListener.default)(sandbox.proxy);
  }, function () {
    return (0, _historyListener.default)();
  }, function () {
    return (0, _dynamicAppend.default)(appName, elementGetter, sandbox.proxy, true, singular, scopedCSS, excludeAssetFilter);
  }];
  var patchersInSandbox = (_patchersInSandbox = {}, (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.LegacyProxy, [].concat(basePatchers)), (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.Proxy, [].concat(basePatchers)), (0, _defineProperty2.default)(_patchersInSandbox, _interfaces.SandBoxType.Snapshot, basePatchers), _patchersInSandbox);
  return (_a = patchersInSandbox[sandbox.type]) === null || _a === void 0 ? void 0 : _a.map(function (patch) {
    return patch();
  });
}

function patchAtBootstrapping(appName, elementGetter, sandbox, singular, scopedCSS, excludeAssetFilter) {
  var _patchersInSandbox2;

  var _a;

  var basePatchers = [function () {
    return (0, _dynamicAppend.default)(appName, elementGetter, sandbox.proxy, false, singular, scopedCSS, excludeAssetFilter);
  }];
  var patchersInSandbox = (_patchersInSandbox2 = {}, (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.LegacyProxy, basePatchers), (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.Proxy, basePatchers), (0, _defineProperty2.default)(_patchersInSandbox2, _interfaces.SandBoxType.Snapshot, basePatchers), _patchersInSandbox2);
  return (_a = patchersInSandbox[sandbox.type]) === null || _a === void 0 ? void 0 : _a.map(function (patch) {
    return patch();
  });
}