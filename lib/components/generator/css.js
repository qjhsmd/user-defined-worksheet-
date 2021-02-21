'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeUpCss = makeUpCss;
var styles = {
  'el-rate': '.el-rate{display: inline-block; vertical-align: text-top;}',
  'el-upload': '.el-upload__tip{line-height: 1.2;}'
};

function addCss(cssList, el) {
  var css = styles[el.__config__.tag];
  css && cssList.indexOf(css) === -1 && cssList.push(css);
  if (el.__config__.children) {
    el.__config__.children.forEach(function (el2) {
      return addCss(cssList, el2);
    });
  }
}

function makeUpCss(conf) {
  var cssList = [];
  conf.fields.forEach(function (el) {
    return addCss(cssList, el);
  });
  return cssList.join('\n');
}