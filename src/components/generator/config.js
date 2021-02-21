

// 表单属性【右面板】
export const formConf = {
  formRef: 'elForm',
  formModel: 'formData',
  size: 'medium',
  labelPosition: 'right',
  labelWidth: 120,
  formRules: 'rules',
  gutter: 15,
  disabled: false,
  span: 20,
  formBtns: true
}

// 输入型组件 【左面板】
export const inputComponents = [
  {
    // 组件的自定义配置
    __config__: {
      label: '单行文本',
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 20,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: []
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    __vModel__: null,
    // 其余的为可直接写在组件标签上的属性
    placeholder: '请输入',
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: '多行文本',
      labelWidth: null,
      showLabel: true,
      tag: 'el-input',
      tagIcon: 'textarea',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 20,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/input'
    },
    __vModel__: null,
    type: 'textarea',
    placeholder: '请输入',
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    style: { width: '100%' },
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  // {
  //   __config__: {
  //     label: '密码',
  //     showLabel: true,
  //     labelWidth: null,
  //     changeTag: true,
  //     tag: 'el-input',
  //     tagIcon: 'password',
  //     defaultValue: undefined,
  //     layout: 'colFormItem',
  //     span: 20,
  //     required: true,
  //     regList: [],
  //     document: 'https://element.eleme.cn/#/zh-CN/component/input'
  //   },
  //   __vModel__: null,
  //   __slot__: {
  //     prepend: '',
  //     append: ''
  //   },
  //   placeholder: '请输入',
  //   'show-password': true,
  //   style: { width: '100%' },
  //   clearable: true,
  //   'prefix-icon': '',
  //   'suffix-icon': '',
  //   maxlength: null,
  //   'show-word-limit': false,
  //   readonly: false,
  //   disabled: false
  // },
  // {
  //   __config__: {
  //     label: '计数器',
  //     showLabel: true,
  //     changeTag: true,
  //     labelWidth: null,
  //     tag: 'el-input-number',
  //     tagIcon: 'number',
  //     defaultValue: undefined,
  //     span: 20,
  //     layout: 'colFormItem',
  //     required: true,
  //     regList: [],
  //     document: 'https://element.eleme.cn/#/zh-CN/component/input-number'
  //   },
  //   __vModel__: null,
  //   placeholder: '请选择',
  //   min: undefined,
  //   max: undefined,
  //   step: 1,
  //   'step-strictly': false,
  //   precision: undefined,
  //   'controls-position': '',
  //   disabled: false
  // },
  // {
  //   __config__: {
  //     label: '编辑器',
  //     showLabel: true,
  //     changeTag: true,
  //     labelWidth: null,
  //     tag: 'tinymce',
  //     tagIcon: 'rich-text',
  //     defaultValue: null,
  //     span: 20,
  //     layout: 'colFormItem',
  //     required: true,
  //     regList: [],
  //     document: 'http://tinymce.ax-z.cn'
  //   },
  //   __vModel__: null,
  //   height: 300, // 编辑器高度
  //   branding: false // 隐藏右下角品牌烙印
  // }
]

// 选择型组件 【左面板】
export const selectComponents = [
  {
    __config__: {
      label: '下拉选择',
      showLabel: true,
      labelWidth: null,
      tag: 'el-select',
      tagIcon: 'select',
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 20,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/select'
    },
    __vModel__: null,
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    placeholder: '请选择',
    style: { width: '100%' },
    clearable: true,
    disabled: false,
    filterable: false,
    multiple: false
  },
  {
    __config__: {
      label: '级联选择',
      showLabel: true,
      labelWidth: null,
      tag: 'el-cascader',
      tagIcon: 'cascader',
      layout: 'colFormItem',
      defaultValue: [],
      dataType: 'dynamic',
      span: 20,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/cascader'
    },
    __vModel__: null,
    options: [{
      id: 1,
      value: 1,
      label: '选项1',
      children: [{
        id: 2,
        value: 2,
        label: '选项1-1'
      }]
    }],
    placeholder: '请选择',
    style: { width: '100%' },
    props: {
      props: {
        multiple: false,
        label: 'label',
        value: 'value',
        children: 'children'
      }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
  },
  {
    __config__: {
      label: '单选框组',
      labelWidth: null,
      showLabel: true,
      tag: 'el-radio-group',
      tagIcon: 'radio',
      changeTag: true,
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 20,
      optionType: 'default',
      regList: [],
      required: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/radio'
    },

    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    style: {},
    size: 'medium',
    disabled: false,
    __vModel__: null,
  },
  {
    __config__: {
      label: '多选框组',
      tag: 'el-checkbox-group',
      tagIcon: 'checkbox',
      defaultValue: [],
      span: 20,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      optionType: 'default',
      required: true,
      regList: [],
      changeTag: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
    },
    __vModel__: null,
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      },
      {
        label: '选项三',
        value: 3
      }]
    },
    style: {},
    size: 'medium',
    min: null,
    max: null,
    disabled: false,

  },
  {
    __config__: {
      label: '开关',
      tag: 'el-switch',
      tagIcon: 'switch',
      defaultValue: false,
      span: 20,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/switch'
    },
    __vModel__: null,
    style: {},
    disabled: false,
    'active-text': '',
    'inactive-text': '',
    'active-color': null,
    'inactive-color': null,
    'active-value': true,
    'inactive-value': false
  },
  // {
  //   __config__: {
  //     label: '滑块',
  //     tag: 'el-slider',
  //     tagIcon: 'slider',
  //     defaultValue: null,
  //     span: 20,
  //     showLabel: true,
  //     layout: 'colFormItem',
  //     labelWidth: null,
  //     required: true,
  //     regList: [],
  //     changeTag: true,
  //     document: 'https://element.eleme.cn/#/zh-CN/component/slider'
  //   },
  //   __vModel__: null,
  //   disabled: false,
  //   min: 0,
  //   max: 100,
  //   step: 1,
  //   'show-stops': false,
  //   range: false
  // },
  {
    __config__: {
      label: '时间选择',
      tag: 'el-time-picker',
      tagIcon: 'time',
      defaultValue: null,
      span: 20,
      showLabel: true,
      layout: 'colFormItem',
      labelWidth: null,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
    },
    __vModel__: null,
    placeholder: '请选择',
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    'picker-options': {
      selectableRange: '00:00:00-23:59:59'
    },
    format: 'HH:mm',
    'value-format': 'HH:mm'
  },
  {
    __config__: {
      label: '时间范围',
      tag: 'el-time-picker',
      tagIcon: 'time-range',
      span: 20,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      defaultValue: null,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
    },
    __vModel__: null,
    style: { width: '100%' },

    disabled: false,
    clearable: true,
    'is-range': true,
    'range-separator': '至',
    'start-placeholder': '开始时间',
    'end-placeholder': '结束时间',
    format: 'HH:mm',
    'value-format': 'HH:mm'
  },
  
  {
    __config__: {
      label: '日期选择',
      tag: 'el-date-picker',
      tagIcon: 'date',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 20,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
    },
    __vModel__: null,
    placeholder: '请选择',
    type: 'date',
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      label: '日期范围',
      tag: 'el-date-picker',
      tagIcon: 'date-range',
      defaultValue: null,
      span: 20,
      showLabel: true,
      labelWidth: null,
      required: true,
      layout: 'colFormItem',
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
    },
    __vModel__: null,
    style: { width: '100%' },
    type: 'daterange',
    'range-separator': '至',
    'start-placeholder': '开始日期',
    'end-placeholder': '结束日期',
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',

    readonly: false
  },
  // {
  //   __config__: {
  //     label: '评分',
  //     tag: 'el-rate',
  //     tagIcon: 'rate',
  //     defaultValue: 0,
  //     span: 20,
  //     showLabel: true,
  //     labelWidth: null,
  //     layout: 'colFormItem',
  //     required: true,
  //     regList: [],
  //     changeTag: true,
  //     document: 'https://element.eleme.cn/#/zh-CN/component/rate'
  //   },
  //   __vModel__: null,
  //   placeholder: '请选择',
  //   style: {},
  //   max: 5,
  //   'allow-half': false,
  //   'show-text': false,
  //   'show-score': false,

  //   disabled: false
  // },
  // {
  //   __config__: {
  //     label: '颜色选择',
  //     tag: 'el-color-picker',
  //     tagIcon: 'color',
  //     span: 20,
  //     defaultValue: null,
  //     showLabel: true,
  //     labelWidth: null,
  //     layout: 'colFormItem',
  //     required: true,
  //     regList: [],
  //     changeTag: true,
  //     document: 'https://element.eleme.cn/#/zh-CN/component/color-picker'
  //   },
  //   __vModel__: null,
  //   'show-alpha': false,
  //   'color-format': '',
  //   disabled: false,

  //   size: 'medium'
  // },
  // {
  //   __config__: {
  //     label: '上传',
  //     tag: 'el-upload',
  //     tagIcon: 'upload',
  //     layout: 'colFormItem',
  //     defaultValue: null,
  //     showLabel: true,
  //     labelWidth: null,
  //     required: true,
  //     span: 20,
  //     showTip: false,
  //     buttonText: '点击上传',
  //     regList: [],
  //     changeTag: true,
  //     fileSize: 2,
  //     sizeUnit: 'MB',
  //     document: 'https://element.eleme.cn/#/zh-CN/component/upload'
  //   },
  //   __slot__: {
  //     'list-type': true
  //   },
  //   __vModel__: null,
  //   placeholder: '请上传',
  //   action: 'https://jsonplaceholder.typicode.com/posts/',
  //   disabled: false,
  //   accept: '',
  //   name: 'file',
  //   'auto-upload': true,
  //   'list-type': 'text',
  //   multiple: false,
  // },
  {
    __config__: {
      label: '自定义查询',
      custom: true,
      checkedValue: null,
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'custom',
      defaultValue: null,
      required: true,
      layout: 'colFormItem',
      span: 20,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: []
    },
    __vModel__: null,
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    
    // 其余的为可直接写在组件标签上的属性
    placeholder: '请选择',
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': 'el-icon-search',
    'suffix-icon': '',
    maxlength: null,
    readonly: true,
    disabled: false,
    cFun: ''
  },
  {
    __config__: {
      label: '机构查询',
      custom: true,
      checkedValue: null,
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'mechanism',
      defaultValue: null,
      required: true,
      layout: 'colFormItem',
      span: 20,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: []
    },
    __vModel__: null,
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: '请选择',
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': 'el-icon-search',
    'suffix-icon': '',
    maxlength: null,
    readonly: true,
    disabled: false,
    cFun: 'ORG_ID'
  },
  {
    __config__: {
      label: '用户查询',
      custom: true,
      checkedValue: null,
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'user',
      defaultValue: null,
      required: true,
      layout: 'colFormItem',
      span: 20,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: []
    },
    __vModel__: null,
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: '请选择',
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': 'el-icon-search',
    'suffix-icon': '',
    maxlength: null,
    readonly: true,
    disabled: false,
    singleChoice: true,
    cFun: 'USER_ID'
  },
  // {
  //   __config__: {
  //     label: '码表查询',
  //     custom: true,
  //     checkedValue: null,
  //     labelWidth: null,
  //     showLabel: true,
  //     changeTag: true,
  //     tag: 'el-input',
  //     tagIcon: 'code',
  //     defaultValue: null,
  //     required: true,
  //     layout: 'colFormItem',
  //     span: 20,
  //     document: 'https://element.eleme.cn/#/zh-CN/component/input',
  //     // 正则校验规则
  //     regList: []
  //   },
  //   __vModel__: null,
  //   // 组件的插槽属性
  //   __slot__: {
  //     prepend: '',
  //     append: ''
  //   },
  //   // 其余的为可直接写在组件标签上的属性
  //   placeholder: '请选择',
  //   style: { width: '100%' },
  //   clearable: true,
  //   'prefix-icon': 'el-icon-search',
  //   'suffix-icon': '',
  //   maxlength: null,
  //   readonly: true,
  //   disabled: false,
  //   singleChoice: true,
  //   codeTableId: ''
  // },

]

// 布局型组件 【左面板】
export const layoutComponents = [
  {
    __config__: {
      layout: 'rowFormItem',
      tagIcon: 'row',
      label: '明细表',
      layoutTree: true,
      children: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/table'
    },
    type: 'default',
    justify: 'start',
    align: 'top',
    tableType: "detailTable"
  },
  // {
  //   __config__: {
  //     label: '按钮',
  //     showLabel: false,
  //     changeTag: true,
  //     labelWidth: null,
  //     tag: 'el-button',
  //     tagIcon: 'button',
  //     defaultValue: undefined,
  //     span: 12,
  //     layout: 'colFormItem',
  //     document: 'https://element.eleme.cn/#/zh-CN/component/button'
  //   },
  //   __slot__: {
  //     default: '查询'
  //   },
  //   type: 'danger',
  //   icon: 'el-icon-search',
  //   round: false,
  //   size: 'medium',
  //   plain: false,
  //   circle: false,
  //   cFun: null,
  //   disabled: false
  // }
]
