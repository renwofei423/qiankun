"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interceptSystemJsProps = interceptSystemJsProps;
exports.clearSystemJsProps = clearSystemJsProps;

/**
 * @author Kuitos
 * @since 2020-04-26
 */
function interceptSystemJsProps(p, value) {
  // FIXME System.js used a indirect call with eval, which would make it scope escape to global
  // To make System.js works well, we write it back to global window temporary
  // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/evaluate.js#L106
  if (p === 'System') {
    // @ts-ignore
    window.System = value;
  } // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/instantiate.js#L357


  if (p === '__cjsWrapper') {
    // @ts-ignore
    window.__cjsWrapper = value;
  }
} // FIXME see interceptSystemJsProps function


function clearSystemJsProps(global, allInactive) {
  if (!allInactive) return;

  if (global.hasOwnProperty('System')) {
    // @ts-ignore
    delete window.System;
  }

  if (global.hasOwnProperty('__cjsWrapper')) {
    // @ts-ignore
    delete window.__cjsWrapper;
  }
}