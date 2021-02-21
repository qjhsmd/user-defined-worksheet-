'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeUpJs = makeUpJs;

var _util = require('util');

var _index = require('@/utils/index');

var _ruleTrigger = require('./ruleTrigger');

var _ruleTrigger2 = _interopRequireDefault(_ruleTrigger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var units = {
  KB: '1024',
  MB: '1024 / 1024',
  GB: '1024 / 1024 / 1024'
};
var confGlobal = void 0;
var inheritAttrs = {
  file: '',
  dialog: 'inheritAttrs: false,'

  /**
   * 组装js 【入口函数】
   * @param {Object} formConfig 整个表单配置
   * @param {String} type 生成类型，文件或弹窗等
   */
};function makeUpJs(formConfig, type) {
  confGlobal = formConfig = JSON.parse(JSON.stringify(formConfig));
  var dataList = [];
  var ruleList = [];
  var optionsList = [];
  var propsList = [];
  var methodList = mixinMethod(type);
  var uploadVarList = [];

  formConfig.fields.forEach(function (el) {
    buildAttributes(el, dataList, ruleList, optionsList, methodList, propsList, uploadVarList);
  });

  var script = buildexport(formConfig, type, dataList.join('\n'), ruleList.join('\n'), optionsList.join('\n'), uploadVarList.join('\n'), propsList.join('\n'), methodList.join('\n'));
  confGlobal = null;
  return script;
}

// 构建组件属性
function buildAttributes(scheme, dataList, ruleList, optionsList, methodList, propsList, uploadVarList) {
  var config = scheme.__config__;
  var slot = scheme.__slot__;
  buildData(scheme, dataList);
  buildRules(scheme, ruleList);

  // 特殊处理options属性
  if (scheme.options || slot && slot.options && slot.options.length) {
    buildOptions(scheme, optionsList);
    if (config.dataType === 'dynamic') {
      var model = scheme.__vModel__ + 'Options';
      var options = (0, _index.titleCase)(model);
      buildOptionMethod('get' + options, model, methodList);
    }
  }

  // 处理props
  if (scheme.props && scheme.props.props) {
    buildProps(scheme, propsList);
  }

  // 处理el-upload的action
  if (scheme.action && config.tag === 'el-upload') {
    uploadVarList.push(scheme.__vModel__ + 'Action: \'' + scheme.action + '\',\n      ' + scheme.__vModel__ + 'fileList: [],');
    methodList.push(buildBeforeUpload(scheme));
    // 非自动上传时，生成手动上传的函数
    if (!scheme['auto-upload']) {
      methodList.push(buildSubmitUpload(scheme));
    }
  }

  // 构建子级组件属性
  if (config.children) {
    config.children.forEach(function (item) {
      buildAttributes(item, dataList, ruleList, optionsList, methodList, propsList, uploadVarList);
    });
  }
}

// 混入处理函数
function mixinMethod(type) {
  var list = [];var minxins = {
    file: confGlobal.formBtns ? {
      submitForm: 'submitForm() {\n        this.$refs[\'' + confGlobal.formRef + '\'].validate(valid => {\n          if(!valid) return\n          // TODO \u63D0\u4EA4\u8868\u5355\n        })\n      },',
      resetForm: 'resetForm() {\n        this.$refs[\'' + confGlobal.formRef + '\'].resetFields()\n      },'
    } : null,
    dialog: {
      onOpen: 'onOpen() {},',
      onClose: 'onClose() {\n        this.$refs[\'' + confGlobal.formRef + '\'].resetFields()\n      },',
      close: 'close() {\n        this.$emit(\'update:visible\', false)\n      },',
      handelConfirm: 'handelConfirm() {\n        this.$refs[\'' + confGlobal.formRef + '\'].validate(valid => {\n          if(!valid) return\n          this.close()\n        })\n      },'
    }
  };

  var methods = minxins[type];
  if (methods) {
    Object.keys(methods).forEach(function (key) {
      list.push(methods[key]);
    });
  }

  return list;
}

// 构建data
function buildData(scheme, dataList) {
  var config = scheme.__config__;
  if (scheme.__vModel__ === undefined) return;
  var defaultValue = JSON.stringify(config.defaultValue);
  dataList.push(scheme.__vModel__ + ': ' + defaultValue + ',');
}

// 构建校验规则
function buildRules(scheme, ruleList) {
  var config = scheme.__config__;
  if (scheme.__vModel__ === undefined) return;
  var rules = [];
  if (_ruleTrigger2.default[config.tag]) {
    if (config.required) {
      var type = (0, _util.isArray)(config.defaultValue) ? 'type: \'array\',' : '';
      var message = (0, _util.isArray)(config.defaultValue) ? '\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A' + config.label : scheme.placeholder;
      if (message === undefined) message = config.label + '\u4E0D\u80FD\u4E3A\u7A7A';
      rules.push('{ required: true, ' + type + ' message: \'' + message + '\', trigger: \'' + _ruleTrigger2.default[config.tag] + '\' }');
    }
    if (config.regList && (0, _util.isArray)(config.regList)) {
      config.regList.forEach(function (item) {
        if (item.pattern) {
          rules.push('{ pattern: ' + eval(item.pattern) + ', message: \'' + item.message + '\', trigger: \'' + _ruleTrigger2.default[config.tag] + '\' }');
        }
      });
    }
    ruleList.push(scheme.__vModel__ + ': [' + rules.join(',') + '],');
  }
}

// 构建options
function buildOptions(scheme, optionsList) {
  if (scheme.__vModel__ === undefined) return;
  // el-cascader直接有options属性，其他组件都是定义在slot中，所以有两处判断
  var options = scheme.options;

  if (!options) options = scheme.__slot__.options;
  if (scheme.__config__.dataType === 'dynamic') {
    options = [];
  }
  var str = scheme.__vModel__ + 'Options: ' + JSON.stringify(options) + ',';
  optionsList.push(str);
}

function buildProps(scheme, propsList) {
  var str = scheme.__vModel__ + 'Props: ' + JSON.stringify(scheme.props.props) + ',';
  propsList.push(str);
}

// el-upload的BeforeUpload
function buildBeforeUpload(scheme) {
  var config = scheme.__config__;
  var unitNum = units[config.sizeUnit];var rightSizeCode = '';var acceptCode = '';var returnList = [];
  if (config.fileSize) {
    rightSizeCode = 'let isRightSize = file.size / ' + unitNum + ' < ' + config.fileSize + '\n    if(!isRightSize){\n      this.$message.error(\'\u6587\u4EF6\u5927\u5C0F\u8D85\u8FC7 ' + config.fileSize + config.sizeUnit + '\')\n    }';
    returnList.push('isRightSize');
  }
  if (scheme.accept) {
    acceptCode = 'let isAccept = new RegExp(\'' + scheme.accept + '\').test(file.type)\n    if(!isAccept){\n      this.$message.error(\'\u5E94\u8BE5\u9009\u62E9' + scheme.accept + '\u7C7B\u578B\u7684\u6587\u4EF6\')\n    }';
    returnList.push('isAccept');
  }
  var str = scheme.__vModel__ + 'BeforeUpload(file) {\n    ' + rightSizeCode + '\n    ' + acceptCode + '\n    return ' + returnList.join('&&') + '\n  },';
  return returnList.length ? str : '';
}

// el-upload的submit
function buildSubmitUpload(scheme) {
  var str = 'submitUpload() {\n    this.$refs[\'' + scheme.__vModel__ + '\'].submit()\n  },';
  return str;
}

function buildOptionMethod(methodName, model, methodList) {
  var str = methodName + '() {\n    // TODO \u53D1\u8D77\u8BF7\u6C42\u83B7\u53D6\u6570\u636E\n    this.' + model + '\n  },';
  methodList.push(str);
}

// js整体拼接
function buildexport(conf, type, data, rules, selectOptions, uploadVar, props, methods) {
  var str = _index.exportDefault + '{\n  ' + inheritAttrs[type] + '\n  components: {},\n  props: [],\n  data () {\n    return {\n      ' + conf.formModel + ': {\n        ' + data + '\n      },\n      ' + conf.formRules + ': {\n        ' + rules + '\n      },\n      ' + uploadVar + '\n      ' + selectOptions + '\n      ' + props + '\n    }\n  },\n  computed: {},\n  watch: {},\n  created () {},\n  mounted () {},\n  methods: {\n    ' + methods + '\n  }\n}';
  return str;
}