'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dialogWrapper = dialogWrapper;
exports.vueTemplate = vueTemplate;
exports.vueScript = vueScript;
exports.cssStyle = cssStyle;
exports.makeUpHtml = makeUpHtml;

var _ruleTrigger = require('./ruleTrigger');

var _ruleTrigger2 = _interopRequireDefault(_ruleTrigger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var confGlobal = void 0; /* eslint-disable max-len */

var someSpanIsNot24 = void 0;

function dialogWrapper(str) {
  return '<el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">\n    ' + str + '\n    <div slot="footer">\n      <el-button @click="close">\u53D6\u6D88</el-button>\n      <el-button type="primary" @click="handelConfirm">\u786E\u5B9A</el-button>\n    </div>\n  </el-dialog>';
}

function vueTemplate(str) {
  return '<template>\n    <div>\n      ' + str + '\n    </div>\n  </template>';
}

function vueScript(str) {
  return '<script>\n    ' + str + '\n  </script>';
}

function cssStyle(cssStr) {
  return '<style>\n    ' + cssStr + '\n  </style>';
}

function buildFormTemplate(scheme, child, type) {
  var labelPosition = '';
  if (scheme.labelPosition !== 'right') {
    labelPosition = 'label-position="' + scheme.labelPosition + '"';
  }
  var disabled = scheme.disabled ? ':disabled="' + scheme.disabled + '"' : '';
  var str = '<el-form ref="' + scheme.formRef + '" :model="' + scheme.formModel + '" :rules="' + scheme.formRules + '" size="' + scheme.size + '" ' + disabled + ' label-width="' + scheme.labelWidth + 'px" ' + labelPosition + '>\n      ' + child + '\n      ' + buildFromBtns(scheme, type) + '\n    </el-form>';
  if (someSpanIsNot24) {
    str = '<el-row :gutter="' + scheme.gutter + '">\n        ' + str + '\n      </el-row>';
  }
  return str;
}

function buildFromBtns(scheme, type) {
  var str = '';
  if (scheme.formBtns && type === 'file') {
    str = '<el-form-item size="large">\n          <el-button type="primary" @click="submitForm">\u63D0\u4EA4</el-button>\n          <el-button @click="resetForm">\u91CD\u7F6E</el-button>\n        </el-form-item>';
    if (someSpanIsNot24) {
      str = '<el-col :span="24">\n          ' + str + '\n        </el-col>';
    }
  }
  return str;
}

// span不为24的用el-col包裹
function colWrapper(scheme, str) {
  if (someSpanIsNot24 || scheme.__config__.span !== 24) {
    return '<el-col :span="' + scheme.__config__.span + '">\n      ' + str + '\n    </el-col>';
  }
  return str;
}

var layouts = {
  colFormItem: function colFormItem(scheme) {
    var config = scheme.__config__;
    var labelWidth = '';
    var label = 'label="' + config.label + '"';
    if (config.labelWidth && config.labelWidth !== confGlobal.labelWidth) {
      labelWidth = 'label-width="' + config.labelWidth + 'px"';
    }
    if (config.showLabel === false) {
      labelWidth = 'label-width="0"';
      label = '';
    }
    var required = !_ruleTrigger2.default[config.tag] && config.required ? 'required' : '';
    var tagDom = tags[config.tag] ? tags[config.tag](scheme) : null;
    var str = '<el-form-item ' + labelWidth + ' ' + label + ' prop="' + scheme.__vModel__ + '" ' + required + '>\n        ' + tagDom + '\n      </el-form-item>';
    str = colWrapper(scheme, str);
    return str;
  },
  rowFormItem: function rowFormItem(scheme) {
    var config = scheme.__config__;
    var type = scheme.type === 'default' ? '' : 'type="' + scheme.type + '"';
    var justify = scheme.type === 'default' ? '' : 'justify="' + scheme.justify + '"';
    var align = scheme.type === 'default' ? '' : 'align="' + scheme.align + '"';
    var gutter = scheme.gutter ? ':gutter="' + scheme.gutter + '"' : '';
    var children = config.children.map(function (el) {
      return layouts[el.__config__.layout](el);
    });
    var str = '<el-row ' + type + ' ' + justify + ' ' + align + ' ' + gutter + '>\n      ' + children.join('\n') + '\n    </el-row>';
    str = colWrapper(scheme, str);
    return str;
  }
};

var tags = {
  'el-button': function elButton(el) {
    var _attrBuilder = attrBuilder(el),
        tag = _attrBuilder.tag,
        disabled = _attrBuilder.disabled;

    var type = el.type ? 'type="' + el.type + '"' : '';
    var icon = el.icon ? 'icon="' + el.icon + '"' : '';
    var round = el.round ? 'round' : '';
    var size = el.size ? 'size="' + el.size + '"' : '';
    var plain = el.plain ? 'plain' : '';
    var circle = el.circle ? 'circle' : '';
    var child = buildElButtonChild(el);

    if (child) child = '\n' + child + '\n'; // 换行
    return '<' + tag + ' ' + type + ' ' + icon + ' ' + round + ' ' + size + ' ' + plain + ' ' + disabled + ' ' + circle + '>' + child + '</' + tag + '>';
  },
  'el-input': function elInput(el) {
    var _attrBuilder2 = attrBuilder(el),
        tag = _attrBuilder2.tag,
        disabled = _attrBuilder2.disabled,
        vModel = _attrBuilder2.vModel,
        clearable = _attrBuilder2.clearable,
        placeholder = _attrBuilder2.placeholder,
        width = _attrBuilder2.width;

    var maxlength = el.maxlength ? ':maxlength="' + el.maxlength + '"' : '';
    var showWordLimit = el['show-word-limit'] ? 'show-word-limit' : '';
    var readonly = el.readonly ? 'readonly' : '';
    var prefixIcon = el['prefix-icon'] ? 'prefix-icon=\'' + el['prefix-icon'] + '\'' : '';
    var suffixIcon = el['suffix-icon'] ? 'suffix-icon=\'' + el['suffix-icon'] + '\'' : '';
    var showPassword = el['show-password'] ? 'show-password' : '';
    var type = el.type ? 'type="' + el.type + '"' : '';
    var autosize = el.autosize && el.autosize.minRows ? ':autosize="{minRows: ' + el.autosize.minRows + ', maxRows: ' + el.autosize.maxRows + '}"' : '';
    var child = buildElInputChild(el);

    if (child) child = '\n' + child + '\n'; // 换行
    return '<' + tag + ' ' + vModel + ' ' + type + ' ' + placeholder + ' ' + maxlength + ' ' + showWordLimit + ' ' + readonly + ' ' + disabled + ' ' + clearable + ' ' + prefixIcon + ' ' + suffixIcon + ' ' + showPassword + ' ' + autosize + ' ' + width + '>' + child + '</' + tag + '>';
  },
  'el-input-number': function elInputNumber(el) {
    var _attrBuilder3 = attrBuilder(el),
        tag = _attrBuilder3.tag,
        disabled = _attrBuilder3.disabled,
        vModel = _attrBuilder3.vModel,
        placeholder = _attrBuilder3.placeholder;

    var controlsPosition = el['controls-position'] ? 'controls-position=' + el['controls-position'] : '';
    var min = el.min ? ':min=\'' + el.min + '\'' : '';
    var max = el.max ? ':max=\'' + el.max + '\'' : '';
    var step = el.step ? ':step=\'' + el.step + '\'' : '';
    var stepStrictly = el['step-strictly'] ? 'step-strictly' : '';
    var precision = el.precision ? ':precision=\'' + el.precision + '\'' : '';

    return '<' + tag + ' ' + vModel + ' ' + placeholder + ' ' + step + ' ' + stepStrictly + ' ' + precision + ' ' + controlsPosition + ' ' + min + ' ' + max + ' ' + disabled + '></' + tag + '>';
  },
  'el-select': function elSelect(el) {
    var _attrBuilder4 = attrBuilder(el),
        tag = _attrBuilder4.tag,
        disabled = _attrBuilder4.disabled,
        vModel = _attrBuilder4.vModel,
        clearable = _attrBuilder4.clearable,
        placeholder = _attrBuilder4.placeholder,
        width = _attrBuilder4.width;

    var filterable = el.filterable ? 'filterable' : '';
    var multiple = el.multiple ? 'multiple' : '';
    var child = buildElSelectChild(el);

    if (child) child = '\n' + child + '\n'; // 换行
    return '<' + tag + ' ' + vModel + ' ' + placeholder + ' ' + disabled + ' ' + multiple + ' ' + filterable + ' ' + clearable + ' ' + width + '>' + child + '</' + tag + '>';
  },
  'el-radio-group': function elRadioGroup(el) {
    var _attrBuilder5 = attrBuilder(el),
        tag = _attrBuilder5.tag,
        disabled = _attrBuilder5.disabled,
        vModel = _attrBuilder5.vModel;

    var size = 'size="' + el.size + '"';
    var child = buildElRadioGroupChild(el);

    if (child) child = '\n' + child + '\n'; // 换行
    return '<' + tag + ' ' + vModel + ' ' + size + ' ' + disabled + '>' + child + '</' + tag + '>';
  },
  'el-checkbox-group': function elCheckboxGroup(el) {
    var _attrBuilder6 = attrBuilder(el),
        tag = _attrBuilder6.tag,
        disabled = _attrBuilder6.disabled,
        vModel = _attrBuilder6.vModel;

    var size = 'size="' + el.size + '"';
    var min = el.min ? ':min="' + el.min + '"' : '';
    var max = el.max ? ':max="' + el.max + '"' : '';
    var child = buildElCheckboxGroupChild(el);

    if (child) child = '\n' + child + '\n'; // 换行
    return '<' + tag + ' ' + vModel + ' ' + min + ' ' + max + ' ' + size + ' ' + disabled + '>' + child + '</' + tag + '>';
  },
  'el-switch': function elSwitch(el) {
    var _attrBuilder7 = attrBuilder(el),
        tag = _attrBuilder7.tag,
        disabled = _attrBuilder7.disabled,
        vModel = _attrBuilder7.vModel;

    var activeText = el['active-text'] ? 'active-text="' + el['active-text'] + '"' : '';
    var inactiveText = el['inactive-text'] ? 'inactive-text="' + el['inactive-text'] + '"' : '';
    var activeColor = el['active-color'] ? 'active-color="' + el['active-color'] + '"' : '';
    var inactiveColor = el['inactive-color'] ? 'inactive-color="' + el['inactive-color'] + '"' : '';
    var activeValue = el['active-value'] !== true ? ':active-value=\'' + JSON.stringify(el['active-value']) + '\'' : '';
    var inactiveValue = el['inactive-value'] !== false ? ':inactive-value=\'' + JSON.stringify(el['inactive-value']) + '\'' : '';

    return '<' + tag + ' ' + vModel + ' ' + activeText + ' ' + inactiveText + ' ' + activeColor + ' ' + inactiveColor + ' ' + activeValue + ' ' + inactiveValue + ' ' + disabled + '></' + tag + '>';
  },
  'el-cascader': function elCascader(el) {
    var _attrBuilder8 = attrBuilder(el),
        tag = _attrBuilder8.tag,
        disabled = _attrBuilder8.disabled,
        vModel = _attrBuilder8.vModel,
        clearable = _attrBuilder8.clearable,
        placeholder = _attrBuilder8.placeholder,
        width = _attrBuilder8.width;

    var options = el.options ? ':options="' + el.__vModel__ + 'Options"' : '';
    var props = el.props ? ':props="' + el.__vModel__ + 'Props"' : '';
    var showAllLevels = el['show-all-levels'] ? '' : ':show-all-levels="false"';
    var filterable = el.filterable ? 'filterable' : '';
    var separator = el.separator === '/' ? '' : 'separator="' + el.separator + '"';

    return '<' + tag + ' ' + vModel + ' ' + options + ' ' + props + ' ' + width + ' ' + showAllLevels + ' ' + placeholder + ' ' + separator + ' ' + filterable + ' ' + clearable + ' ' + disabled + '></' + tag + '>';
  },
  'el-slider': function elSlider(el) {
    var _attrBuilder9 = attrBuilder(el),
        tag = _attrBuilder9.tag,
        disabled = _attrBuilder9.disabled,
        vModel = _attrBuilder9.vModel;

    var min = el.min ? ':min=\'' + el.min + '\'' : '';
    var max = el.max ? ':max=\'' + el.max + '\'' : '';
    var step = el.step ? ':step=\'' + el.step + '\'' : '';
    var range = el.range ? 'range' : '';
    var showStops = el['show-stops'] ? ':show-stops="' + el['show-stops'] + '"' : '';

    return '<' + tag + ' ' + min + ' ' + max + ' ' + step + ' ' + vModel + ' ' + range + ' ' + showStops + ' ' + disabled + '></' + tag + '>';
  },
  'el-time-picker': function elTimePicker(el) {
    var _attrBuilder10 = attrBuilder(el),
        tag = _attrBuilder10.tag,
        disabled = _attrBuilder10.disabled,
        vModel = _attrBuilder10.vModel,
        clearable = _attrBuilder10.clearable,
        placeholder = _attrBuilder10.placeholder,
        width = _attrBuilder10.width;

    var startPlaceholder = el['start-placeholder'] ? 'start-placeholder="' + el['start-placeholder'] + '"' : '';
    var endPlaceholder = el['end-placeholder'] ? 'end-placeholder="' + el['end-placeholder'] + '"' : '';
    var rangeSeparator = el['range-separator'] ? 'range-separator="' + el['range-separator'] + '"' : '';
    var isRange = el['is-range'] ? 'is-range' : '';
    var format = el.format ? 'format="' + el.format + '"' : '';
    var valueFormat = el['value-format'] ? 'value-format="' + el['value-format'] + '"' : '';
    var pickerOptions = el['picker-options'] ? ':picker-options=\'' + JSON.stringify(el['picker-options']) + '\'' : '';

    return '<' + tag + ' ' + vModel + ' ' + isRange + ' ' + format + ' ' + valueFormat + ' ' + pickerOptions + ' ' + width + ' ' + placeholder + ' ' + startPlaceholder + ' ' + endPlaceholder + ' ' + rangeSeparator + ' ' + clearable + ' ' + disabled + '></' + tag + '>';
  },
  'el-date-picker': function elDatePicker(el) {
    var _attrBuilder11 = attrBuilder(el),
        tag = _attrBuilder11.tag,
        disabled = _attrBuilder11.disabled,
        vModel = _attrBuilder11.vModel,
        clearable = _attrBuilder11.clearable,
        placeholder = _attrBuilder11.placeholder,
        width = _attrBuilder11.width;

    var startPlaceholder = el['start-placeholder'] ? 'start-placeholder="' + el['start-placeholder'] + '"' : '';
    var endPlaceholder = el['end-placeholder'] ? 'end-placeholder="' + el['end-placeholder'] + '"' : '';
    var rangeSeparator = el['range-separator'] ? 'range-separator="' + el['range-separator'] + '"' : '';
    var format = el.format ? 'format="' + el.format + '"' : '';
    var valueFormat = el['value-format'] ? 'value-format="' + el['value-format'] + '"' : '';
    var type = el.type === 'date' ? '' : 'type="' + el.type + '"';
    var readonly = el.readonly ? 'readonly' : '';

    return '<' + tag + ' ' + type + ' ' + vModel + ' ' + format + ' ' + valueFormat + ' ' + width + ' ' + placeholder + ' ' + startPlaceholder + ' ' + endPlaceholder + ' ' + rangeSeparator + ' ' + clearable + ' ' + readonly + ' ' + disabled + '></' + tag + '>';
  },
  'el-rate': function elRate(el) {
    var _attrBuilder12 = attrBuilder(el),
        tag = _attrBuilder12.tag,
        disabled = _attrBuilder12.disabled,
        vModel = _attrBuilder12.vModel;

    var max = el.max ? ':max=\'' + el.max + '\'' : '';
    var allowHalf = el['allow-half'] ? 'allow-half' : '';
    var showText = el['show-text'] ? 'show-text' : '';
    var showScore = el['show-score'] ? 'show-score' : '';

    return '<' + tag + ' ' + vModel + ' ' + max + ' ' + allowHalf + ' ' + showText + ' ' + showScore + ' ' + disabled + '></' + tag + '>';
  },
  'el-color-picker': function elColorPicker(el) {
    var _attrBuilder13 = attrBuilder(el),
        tag = _attrBuilder13.tag,
        disabled = _attrBuilder13.disabled,
        vModel = _attrBuilder13.vModel;

    var size = 'size="' + el.size + '"';
    var showAlpha = el['show-alpha'] ? 'show-alpha' : '';
    var colorFormat = el['color-format'] ? 'color-format="' + el['color-format'] + '"' : '';

    return '<' + tag + ' ' + vModel + ' ' + size + ' ' + showAlpha + ' ' + colorFormat + ' ' + disabled + '></' + tag + '>';
  },
  'el-upload': function elUpload(el) {
    var tag = el.__config__.tag;

    var disabled = el.disabled ? ':disabled=\'true\'' : '';
    var action = el.action ? ':action="' + el.__vModel__ + 'Action"' : '';
    var multiple = el.multiple ? 'multiple' : '';
    var listType = el['list-type'] !== 'text' ? 'list-type="' + el['list-type'] + '"' : '';
    var accept = el.accept ? 'accept="' + el.accept + '"' : '';
    var name = el.name !== 'file' ? 'name="' + el.name + '"' : '';
    var autoUpload = el['auto-upload'] === false ? ':auto-upload="false"' : '';
    var beforeUpload = ':before-upload="' + el.__vModel__ + 'BeforeUpload"';
    var fileList = ':file-list="' + el.__vModel__ + 'fileList"';
    var ref = 'ref="' + el.__vModel__ + '"';
    var child = buildElUploadChild(el);

    if (child) child = '\n' + child + '\n'; // 换行
    return '<' + tag + ' ' + ref + ' ' + fileList + ' ' + action + ' ' + autoUpload + ' ' + multiple + ' ' + beforeUpload + ' ' + listType + ' ' + accept + ' ' + name + ' ' + disabled + '>' + child + '</' + tag + '>';
  },
  tinymce: function tinymce(el) {
    var _attrBuilder14 = attrBuilder(el),
        tag = _attrBuilder14.tag,
        vModel = _attrBuilder14.vModel;

    var height = el.height ? ':height="' + el.height + '"' : '';
    var branding = el.branding ? ':branding="' + el.branding + '"' : '';
    return '<' + tag + ' ' + vModel + ' ' + height + ' ' + branding + '></' + tag + '>';
  }
};

function attrBuilder(el) {
  return {
    tag: el.__config__.tag,
    vModel: 'v-model="' + confGlobal.formModel + '.' + el.__vModel__ + '"',
    clearable: el.clearable ? 'clearable' : '',
    placeholder: el.placeholder ? 'placeholder="' + el.placeholder + '"' : '',
    width: el.style && el.style.width ? ':style="{width: \'100%\'}"' : '',
    disabled: el.disabled ? ':disabled=\'true\'' : ''
  };
}

// el-buttin 子级
function buildElButtonChild(scheme) {
  var children = [];
  var slot = scheme.__slot__ || {};
  if (slot.default) {
    children.push(slot.default);
  }
  return children.join('\n');
}

// el-input 子级
function buildElInputChild(scheme) {
  var children = [];
  var slot = scheme.__slot__;
  if (slot && slot.prepend) {
    children.push('<template slot="prepend">' + slot.prepend + '</template>');
  }
  if (slot && slot.append) {
    children.push('<template slot="append">' + slot.append + '</template>');
  }
  return children.join('\n');
}

// el-select 子级
function buildElSelectChild(scheme) {
  var children = [];
  var slot = scheme.__slot__;
  if (slot && slot.options && slot.options.length) {
    children.push('<el-option v-for="(item, index) in ' + scheme.__vModel__ + 'Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>');
  }
  return children.join('\n');
}

// el-radio-group 子级
function buildElRadioGroupChild(scheme) {
  var children = [];
  var slot = scheme.__slot__;
  var config = scheme.__config__;
  if (slot && slot.options && slot.options.length) {
    var tag = config.optionType === 'button' ? 'el-radio-button' : 'el-radio';
    var border = config.border ? 'border' : '';
    children.push('<' + tag + ' v-for="(item, index) in ' + scheme.__vModel__ + 'Options" :key="index" :label="item.value" :disabled="item.disabled" ' + border + '>{{item.label}}</' + tag + '>');
  }
  return children.join('\n');
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme) {
  var children = [];
  var slot = scheme.__slot__;
  var config = scheme.__config__;
  if (slot && slot.options && slot.options.length) {
    var tag = config.optionType === 'button' ? 'el-checkbox-button' : 'el-checkbox';
    var border = config.border ? 'border' : '';
    children.push('<' + tag + ' v-for="(item, index) in ' + scheme.__vModel__ + 'Options" :key="index" :label="item.value" :disabled="item.disabled" ' + border + '>{{item.label}}</' + tag + '>');
  }
  return children.join('\n');
}

// el-upload 子级
function buildElUploadChild(scheme) {
  var list = [];
  var config = scheme.__config__;
  if (scheme['list-type'] === 'picture-card') list.push('<i class="el-icon-plus"></i>');else list.push('<el-button size="small" type="primary" icon="el-icon-upload">' + config.buttonText + '</el-button>');
  if (config.showTip) list.push('<div slot="tip" class="el-upload__tip">\u53EA\u80FD\u4E0A\u4F20\u4E0D\u8D85\u8FC7 ' + config.fileSize + config.sizeUnit + ' \u7684' + scheme.accept + '\u6587\u4EF6</div>');
  return list.join('\n');
}

/**
 * 组装html代码。【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
function makeUpHtml(formConfig, type) {
  var htmlList = [];
  confGlobal = formConfig;
  // 判断布局是否都沾满了24个栅格，以备后续简化代码结构
  someSpanIsNot24 = formConfig.fields.some(function (item) {
    return item.__config__.span !== 24;
  });
  // 遍历渲染每个组件成html
  formConfig.fields.forEach(function (el) {
    htmlList.push(layouts[el.__config__.layout](el));
  });
  var htmlStr = htmlList.join('\n');
  // 将组件代码放进form标签
  var temp = buildFormTemplate(formConfig, htmlStr, type);
  // dialog标签包裹代码
  if (type === 'dialog') {
    temp = dialogWrapper(temp);
  }
  confGlobal = null;
  return temp;
}