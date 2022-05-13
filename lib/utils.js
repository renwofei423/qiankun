"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = toArray;
exports.sleep = sleep;
exports.nextTick = nextTick;
exports.isConstructable = isConstructable;
exports.isBoundedFunction = isBoundedFunction;
exports.uniq = uniq;
exports.getDefaultTplWrapper = getDefaultTplWrapper;
exports.getWrapperId = getWrapperId;
exports.validateExportLifecycle = validateExportLifecycle;
exports.performanceMark = performanceMark;
exports.performanceMeasure = performanceMeasure;
exports.isEnableScopedCSS = isEnableScopedCSS;
exports.Deferred = exports.isCallable = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _snakeCase2 = _interopRequireDefault(require("lodash/snakeCase"));

function toArray(array) {
  return Array.isArray(array) ? array : [array];
}

function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
/**
 * run a callback after next tick
 * @param cb
 */


function nextTick(cb) {
  Promise.resolve().then(cb);
}

function isConstructable(fn) {
  var constructableFunctionRegex = /^function\b\s[A-Z].*/;
  var classRegex = /^class\b/; // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数

  return fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1 || constructableFunctionRegex.test(fn.toString()) || classRegex.test(fn.toString());
}
/**
 * in safari
 * typeof document.all === 'undefined' // true
 * typeof document.all === 'function' // true
 * We need to discriminate safari for better performance
 */


var naughtySafari = typeof document.all === 'function' && typeof document.all === 'undefined';
var isCallable = naughtySafari ? function (fn) {
  return typeof fn === 'function' && typeof fn !== 'undefined';
} : function (fn) {
  return typeof fn === 'function';
};
exports.isCallable = isCallable;

function isBoundedFunction(fn) {
  /*
   indexOf is faster than startsWith
   see https://jsperf.com/string-startswith/72
   */
  return fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
}
/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */


function uniq(array) {
  return array.filter(function filter(element) {
    return element in this ? false : this[element] = true;
  }, {});
}

function getDefaultTplWrapper(id, name) {
  return function (tpl) {
    return "<div id=\"".concat(getWrapperId(id), "\" data-name=\"").concat(name, "\">").concat(tpl, "</div>");
  };
}

function getWrapperId(id) {
  return "__qiankun_microapp_wrapper_for_".concat((0, _snakeCase2.default)(id), "__");
}
/** 校验子应用导出的 生命周期 对象是否正确 */


function validateExportLifecycle(exports) {
  var _ref = exports !== null && exports !== void 0 ? exports : {},
      bootstrap = _ref.bootstrap,
      mount = _ref.mount,
      unmount = _ref.unmount;

  return (0, _isFunction2.default)(bootstrap) && (0, _isFunction2.default)(mount) && (0, _isFunction2.default)(unmount);
}

var Deferred = function Deferred() {
  var _this = this;

  (0, _classCallCheck2.default)(this, Deferred);
  this.promise = new Promise(function (resolve, reject) {
    _this.resolve = resolve;
    _this.reject = reject;
  });
};

exports.Deferred = Deferred;
var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

function performanceMark(markName) {
  if (supportsUserTiming) {
    performance.mark(markName);
  }
}

function performanceMeasure(measureName, markName) {
  if (supportsUserTiming) {
    performance.measure(measureName, markName);
    performance.clearMarks(markName);
    performance.clearMeasures(measureName);
  }
}

function isEnableScopedCSS(opt) {
  if ((0, _typeof2.default)(opt.sandbox) !== 'object') {
    return false;
  }

  if (opt.sandbox.strictStyleIsolation) {
    return false;
  }

  return !!opt.sandbox.experimentalStyleIsolation;
}