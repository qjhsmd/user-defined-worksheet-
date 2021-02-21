<template>
    <div class="test-form">
        <div class="">
            <el-input v-model="ab" @change.native="test(1)" @input.native="test(2)" @click.native="test(3)"></el-input>
        </div>
        <parser ref="fmsParser" :form-conf="formConf" @funcOther="funcOther" @funcChange="queryfuncChange" @submit="sumbitForm1" @func="queryfunc" @funcInput="queryfuncInput" />
    </div>
</template>

<script>
import Parser from "../Parser";

export default {
    components: {
        Parser
    },
    props: {},
    data() {
        return {
            ab: '',
            mechanism: false,
            checkedValue: [],
            checkedMechanism: [],
            defaultProps: {
                children: "children",
                label: "label"
            },
            options: [
                {
                    value: "选项1",
                    label: "黄金糕"
                },
                {
                    value: "选项2",
                    label: "双皮奶"
                },
                {
                    value: "选项3",
                    label: "蚵仔煎"
                },
                {
                    value: "选项4",
                    label: "龙须面"
                },
                {
                    value: "选项5",
                    label: "北京烤鸭"
                }
            ],
            value: "选项1",
            model: "field101",
            dialogVisible: false,
            a: "",
            key2: +new Date(),
            formConf: {
                "fields": [
                    {
    "__config__": {
      "label": "asd",
      "tag": "el-date-picker",
      "tagIcon": "date",
      "defaultValue": null,
      "showLabel": true,
      "labelWidth": null,
      "span": 20,
      "layout": "colFormItem",
      "required": true,
      "regList": [{
        "pattern": "",
        "message": ""
      }],
      "changeTag": true,
      "document": "https://element.eleme.cn/#/zh-CN/component/date-picker"
    },
    "placeholder": "请选择单行文本",
    "type": "date",
    event: "change",
    add2: "a",
    result: "a3",
    fun:`function test(value,that,config){
        let str = value['asd']
        var d = new Date(str.replace(/-/g,"/"));
        var todaysDate = new Date();
        if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
        } else {
            that.formConfCopy.fields.forEach(el => {
                console.log(el)
                if (el.__vModel__ === 'asd') {
                    
                    that.$set(el.__config__, 'defaultValue', '');
                    that.formData['asd'] = '';
                }
            })
            that.$message({
                message: '当前日期不是当天，请重新选择',
                type: 'error'
            });
        }
    }`,
    // function test(value,that,config){
    //     console.log(that); 
    //     that.formConfCopy.fields.forEach(el => {
    //         if (el.__vModel__ === 'a') {
    //             that.$set(el.__config__, 'defaultValue', that.DateDiff(value['m'][0],value['m'][1])); 
    //             that.formData[config.result] = that.DateDiff(value['m'][0],value['m'][1])
    //         }
    //     });
    // }",
    "__vModel__": "asd",
    "style": {
      "width": "100%"
    },
    "disabled": false,
    "clearable": true,
    "format": "yyyy-MM-dd",
    "value-format": "yyyy-MM-dd",
    "readonly": false,
    "tableType": "subTable",
    "maxlength": 11
  },
                    {
    "__config__": {
      "layout": "rowFormItem",
      "tagIcon": "row",
      "label": "明细表",
      "layoutTree": true,
      "children": [{
        "__config__": {
          "label": "单行文本",
          "labelWidth": null,
          "showLabel": true,
          "changeTag": true,
          "tag": "el-input",
          "tagIcon": "input",
          "required": true,
          "layout": "colFormItem",
          "span": 20,
          "document": "https://element.eleme.cn/#/zh-CN/component/input",
          "regList": [],
          "formId": 107,
          "renderKey": 1610002617748
        },
        "__slot__": {
          "prepend": "",
          "append": ""
        },
        // fun: "function test(value,that,config){
            // console.log(that.formData); 
            // that.formConfCopy.fields.forEach(el => {
            //     if (el.__vModel__ === 'a3') {
            //         that.$set(el.__config__, 'defaultValue', Number(value['a1']) + Number(value['a2'])); 
            //         that.formData['a3'] = Number(value['a1']) + Number(value['a2'])}});}",
        fun:`function test(value,that,config){
            that.formConfCopy.fields.forEach(el => {
                if(el.__config__.hasOwnProperty('children')) {
                    el.__config__.children.forEach(item => {
                        if (item.__vModel__ === 'a3') {
                            that.$set(item.__config__, 'defaultValue', Number(value['a1']) + Number(value['a2']));
                            that.formData['a3'] = Number(value['a1']) + Number(value['a2']);
                        }
                    })
                }
            })}`,
        event: "change",
        add2: "a",
        result: "a3",
        "__vModel__": "a1",
        "placeholder": "请输入单行文本",
        "style": {
          "width": "100%"
        },
        "clearable": true,
        "prefix-icon": "",
        "suffix-icon": "",
        "maxlength": null,
        "show-word-limit": false,
        "readonly": false,
        "disabled": false,
        "tableType": "detailTable",
        "parentID": "row104"
      }, , {
        "__config__": {
          "label": "单行文本",
          "labelWidth": null,
          "showLabel": true,
          "changeTag": true,
          "tag": "el-input",
          "tagIcon": "input",
          "required": true,
          "layout": "colFormItem",
          "span": 20,
          "document": "https://element.eleme.cn/#/zh-CN/component/input",
          "regList": [],
          "formId": 105,
          "renderKey": 1610000760008
        },
        "__slot__": {
          "prepend": "",
          "append": ""
        },
        "__vModel__": "a3",
        "placeholder": "请输入单行文本",
        "style": {
          "width": "100%"
        },
        "clearable": true,
        "prefix-icon": "",
        "suffix-icon": "",
        "maxlength": null,
        "show-word-limit": false,
        "readonly": false,
        "disabled": false,
        "tableType": "detailTable",
        "parentID": "row104",
        "event": "input"
      }],
      "document": "https://element.eleme.cn/#/zh-CN/component/table",
      "formId": 104,
      "span": 20,
      "renderKey": 1610000735746,
      "componentName": "row104",
      "gutter": 15
    },
    "type": "default",
    "justify": "start",
    "align": "top",
    "tableType": "detailTable",
    "event": "click"
  },
                    
                    {
    "__config__": {
      "label": "自定义查询",
      "custom": true,
      "checkedValue": null,
      "labelWidth": null,
      "showLabel": true,
      "changeTag": true,
      "tag": "el-input",
      "tagIcon": "Customcodetable",
      "defaultValue": null,
      "required": true,
      "layout": "colFormItem",
      "span": 20,
      "document": "https://element.eleme.cn/#/zh-CN/component/input",
      "regList": [],
      "formId": 101,
      "renderKey": 1609989115700
    },
    "__vModel__": null,
    "__slot__": {
      "prepend": "",
      "append": ""
    },
    "placeholder": "请选择自定义查询",
    "style": {
      "width": "100%"
    },
    "clearable": true,
    "prefix-icon": "el-icon-search",
    "suffix-icon": "",
    "maxlength": null,
    "readonly": true,
    "disabled": false,
    "singleChoice": false,
    "codeName": "",
    "codeModel": "",
    "codeType": "3",
    "codeData": "",
    "codeTableId": "",
    "tableType": "subTable"
  },{
    "__config__": {
      "label": "数据项查询",
      "custom": true,
      "checkedValue": null,
      "labelWidth": null,
      "showLabel": true,
      "changeTag": true,
      "tag": "el-input",
      "tagIcon": "custom",
      "defaultValue": null,
      "required": true,
      "layout": "colFormItem",
      "span": 20,
      "document": "https://element.eleme.cn/#/zh-CN/component/input",
      "regList": [],
      "formId": 101,
      "renderKey": 1609989021066
    },
    "__vModel__": 'pp',
    "__slot__": {
      "prepend": "",
      "append": ""
    },
    "placeholder": "请选择数据项查询",
    "style": {
      "width": "100%"
    },
    "clearable": true,
    "prefix-icon": "el-icon-search",
    "suffix-icon": "",
    "maxlength": null,
    "readonly": true,
    "disabled": false,
    "cFun": "",
    "tableType": "subTable"
  },{
                        "__config__": {
                        "label": "日期范围",
                        "tag": "el-date-picker",
                        "tagIcon": "date-range",
                        "defaultValue": null,
                        "span": 20,
                        "showLabel": true,
                        "labelWidth": null,
                        "required": true,
                        "layout": "colFormItem",
                        "regList": [],
                        "changeTag": true,
                        "document": "https://element.eleme.cn/#/zh-CN/component/date-picker",
                        "formId": 108,
                        "renderKey": 1609753130323
                        },
                        fun: "function test(value,that,config){console.log(that); that.formConfCopy.fields.forEach(el => {if (el.__vModel__ === 'a') {that.$set(el.__config__, 'defaultValue', that.DateDiff(value['m'][0],value['m'][1])); that.formData[config.result] = that.DateDiff(value['m'][0],value['m'][1])}});}",
                        event: "change",
                        add2: "a",
                        result: "a",
                        "__vModel__": 'm',
                        "style": {
                        "width": "100%"
                        },
                        "type": "daterange",
                        "range-separator": "至",
                        "start-placeholder": "开始日期",
                        "end-placeholder": "结束日期",
                        "disabled": false,
                        "clearable": true,
                        "format": "yyyy-MM-dd",
                        "value-format": "yyyy-MM-dd",
                        "readonly": false,
                        "tableType": "subTable"
                    },{
                    "__config__": {
                        "label": "a",
                        "labelWidth": null,
                        "showLabel": true,
                        "changeTag": true,
                        "tag": "el-input",
                        "tagIcon": "input",
                        "required": true,
                        "layout": "colFormItem",
                        "span": 20,
                        "document": "https://element.eleme.cn/#/zh-CN/component/input",
                        "regList": [],
                        "formId": 101,
                        "renderKey": 1608689211036,
                    },
                    
                    
                    // fun: "function test(value,that,config){console.log(that); that.formConfCopy.fields.forEach(el => {if (el.__vModel__ === 'd') {that.$set(el.__config__, 'defaultValue', Number(value['a']) + Number(value['b'])); that.formData[config.result] = Number(value['a']) + Number(value['b'])}});}",
                    fun: "function test(value,that,config){var time = new Date(); if(Number(value['a']) == '1') {that.formConfCopy.fields.forEach(el => {if (el.__vModel__ === 'd') {that.$set(el.__config__, 'defaultValue', time.toLocaleDateString()); that.formData['d'] = time.toLocaleDateString()}});}}",
                    event: "click",
                    add2: "b",
                    result: "d",
                    "__slot__": {
                        "prepend": "",
                        "append": ""
                    },
                    "__vModel__": 'a',
                    "placeholder": "请输入单行文本",
                    "style": {
                        "width": "100%"
                    },
                    "clearable": true,
                    "prefix-icon": "",
                    "suffix-icon": "",
                    "maxlength": null,
                    "show-word-limit": false,
                    "readonly": false,
                    "disabled": false,
                    "tableType": "subTable"
                }, {
                    "__config__": {
                        "label": "b",
                        "labelWidth": null,
                        "showLabel": true,
                        "changeTag": true,
                        "tag": "el-input",
                        "tagIcon": "input",
                        "required": true,
                        "layout": "colFormItem",
                        "span": 20,
                        "document": "https://element.eleme.cn/#/zh-CN/component/input",
                        "regList": [],
                        "formId": 102,
                        "renderKey": 1608689211618
                    },
                    "__slot__": {
                        "prepend": "",
                        "append": ""
                    },
                    fun: "function test(value,that,config){console.log(that); that.formConfCopy.fields.forEach(el => {if (el.__vModel__ === 'c') {that.$set(el.__config__, 'defaultValue', Number(value['a']) + Number(value['b'])); that.formData[config.result] = Number(value['a']) + Number(value['b'])}});}",
                    event: "input",
                    add2: "a",
                    result: "c",
                    "__vModel__": 'b',
                    "placeholder": "请输入单行文本",
                    "style": {
                        "width": "100%"
                    },
                    "clearable": true,
                    "prefix-icon": "",
                    "suffix-icon": "",
                    "maxlength": null,
                    "show-word-limit": false,
                    "readonly": false,
                    "disabled": false,
                    "tableType": "subTable"
                }, 
                {
    "__config__": {
      "label": "单行文本",
      "labelWidth": null,
      "showLabel": true,
      "changeTag": true,
      "tag": "el-input",
      "tagIcon": "input",
      "required": true,
      "layout": "colFormItem",
      "span": 24,
      "document": "https://element.eleme.cn/#/zh-CN/component/input",
      "regList": [{
        "pattern": "/^1(3|4|5|7|8|9)\\d{9}$/",
        "message": "手机号格式错误"
      }]
    },
    "__slot__": {
      "prepend": "",
      "append": ""
    },
    "__vModel__": 'cd',
    "placeholder": "请输入手机号",
    "style": {
      "width": "100%"
    },
    "clearable": true,
    "prefix-icon": "el-icon-mobile",
    "suffix-icon": "",
    "maxlength": 11,
    "show-word-limit": true,
    "readonly": false,
    "disabled": false,
    "tableType": "subTable",
    "showfun": "that.formConfCopy.fields.forEach(el => { if (el.__vModel__ === 'c') {that.$set(el.__config__, 'defaultValue', Number(value['a']) + Number(value['b']));that.formData[config.result] = Number(value['a']) + Number(value['b'])}})",
    "fun": "function test(value,that,config){that.formConfCopy.fields.forEach(el => { if (el.__vModel__ === 'c') {that.$set(el.__config__, 'defaultValue', Number(value['a']) + Number(value['b']));that.formData[config.result] = Number(value['a']) + Number(value['b'])}})}",
    "event": "change"
  },{
                    "__config__": {
                        "label": "c",
                        "labelWidth": null,
                        "showLabel": true,
                        "changeTag": true,
                        "tag": "el-input",
                        "tagIcon": "input",
                        "required": true,
                        "layout": "colFormItem",
                        "span": 20,
                        "document": "https://element.eleme.cn/#/zh-CN/component/input",
                        "regList": [],
                        "formId": 103,
                        "renderKey": 1608689212576
                    },
                    "__slot__": {
                        "prepend": "",
                        "append": ""
                    },
                    "__vModel__": 'c',
                    "placeholder": "请输入单行文本",
                    "style": {
                        "width": "100%"
                    },
                    "clearable": true,
                    "prefix-icon": "",
                    "suffix-icon": "",
                    "maxlength": null,
                    "show-word-limit": false,
                    "readonly": false,
                    "disabled": false,
                    "tableType": "subTable"
                }, {
                    "__config__": {
                        "label": "d",
                        "labelWidth": null,
                        "showLabel": true,
                        "changeTag": true,
                        "tag": "el-input",
                        "tagIcon": "input",
                        "required": true,
                        "layout": "colFormItem",
                        "span": 20,
                        "document": "https://element.eleme.cn/#/zh-CN/component/input",
                        "regList": [],
                        "formId": 103,
                        "renderKey": 1608689212576
                    },
                    "__slot__": {
                        "prepend": "",
                        "append": ""
                    },
                    "__vModel__": 'd',
                    "placeholder": "请输入单行文本",
                    "style": {
                        "width": "100%"
                    },
                    "clearable": true,
                    "prefix-icon": "",
                    "suffix-icon": "",
                    "maxlength": null,
                    "show-word-limit": false,
                    "readonly": false,
                    "disabled": false,
                    "tableType": "subTable"
                }],
                "formRef": "elForm",
                "formModel": "formData",
                "size": "medium",
                "labelPosition": "right",
                "labelWidth": 120,
                "formRules": "rules",
                "gutter": 15,
                "disabled": false,
                "span": 20,
                "formBtns": true
            }

        };
    },
    computed: {},
    watch: {},
    created() { },
    mounted() { },
    methods: {
        test(e) {
            if(e == 1) {
                console.log(1)
            }
            if(e == 2) {
                console.log(2)
            }
            if(e == 3) {
                console.log(3)
            }
        },
        change() {
            this.key2 = +new Date();
            const t = this.formConf;
            this.formConf = this.formConf2;
            this.formConf2 = t;
        },
        funcOther(a, model, value ,codetype) {
            console.log(13888)
        },
        queryfuncChange(a, model, value ,codetype) {
            if(codetype.event == 'change') {
                console.log(13)
                this.$refs.fmsParser.setcon(a, model, value ,codetype)
            }
        },
        queryfuncInput(a, model, value ,codetype) {
            if(codetype.event == 'input') {
                console.log(12)
                this.$refs.fmsParser.setcon(a, model, value ,codetype)
            }
        },
        queryfunc(a, model, value ,codetype, type) {
          console.log(a)
          // console.log(model)
          // console.log(value)
          console.log(type)
          if(type == 2) {
            if(codetype.event == 'click') {
                console.log(1)
                this.$refs.fmsParser.setcon(a, model, value ,codetype)
            }
          }
          // console.log()
          
          // if(model == "a") {
          //   console.log(this)
          //   // this.formData['c'] = '666'
          //   this.formConf.fields.forEach(el => {
          //       if (el.__vModel__ === 'c') {
          //           this.$set(el.__config__, "defaultValue", 555);
          //           el.__config__.checkedValue = 555;
          //       }
          //   });
          // }
          
        },
        sumbitForm1(data) { },
        sumbitForm2(data) { },
        defineMechanism() {
            let data = this.$refs.fmsParser.refresh();
        },
        defineValue(data, option) {
            option.forEach(option => {
                data.forEach(check => {
                    if (option.label === check) {
                        this.checkedValue.push(option.value);
                    }
                });
            });
            this.formConf.fields.forEach(el => {
                if (el.__vModel__ === this.model) {
                    this.$set(el.__config__, "defaultValue", data.join(","));
                    el.__config__.checkedValue = this.checkedValue;
                }
            });
            this.mechanism = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.test-form {
    margin: 15px auto;
    width: 800px;
    padding: 15px;
}
</style>
