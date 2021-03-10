<script>
import { deepClone } from '@/utils/index'
import render from '@/components/render/render.js'
import Vue from 'vue'
const ruleTrigger = {
  'el-input': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'el-rate': 'change'
}
const layouts = {
  colFormItem(h, scheme) {
    const config = scheme.__config__
    const listeners = buildListeners.call(this, scheme)
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    return (
      <el-col span={config.span}>
        <el-form-item label-width={labelWidth} prop={scheme.__vModel__} v-show={config.showInput== undefined || config.showInput == true}
          label={config.showLabel ? config.label : ''}>
          <render conf={scheme} {...{ on: listeners }} />
        </el-form-item>
      </el-col>
    )
  },
  rowFormItem(h, scheme) {
    let child = renderChildren.apply(this, arguments)
    if (scheme.type === 'flex') {
      child = <el-row type={scheme.type} justify={scheme.justify} align={scheme.align}>
              {child}
            </el-row>
    }
    return (
      <el-col span={scheme.span}>
        <el-row gutter={scheme.gutter}>
          {child}
        </el-row>
      </el-col>
    )
  }
}
function renderFrom(h) {
  const { formConfCopy } = this
  return (
    <el-row gutter={formConfCopy.gutter}>
      <el-form
        size={formConfCopy.size}
        label-position={formConfCopy.labelPosition}
        disabled={formConfCopy.disabled}
        label-width={`${formConfCopy.labelWidth}px`}
        ref={formConfCopy.formRef}
        // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
        props={{ model: this[formConfCopy.formModel] }}
        rules={this[formConfCopy.formRules]}
      >
        {renderFormItem.call(this, h, formConfCopy.fields)}
      </el-form>
    </el-row>
  )
}
// {formConfCopy.formBtns && formBtns.call(this, h)}
function formBtns(h) {
  return <el-col>
    <el-form-item size="large">
      <el-button type="primary" onClick={this.submitForm}>提交</el-button>
      <el-button onClick={this.resetForm}>重置</el-button>
    </el-form-item>
  </el-col>
}
function renderFormItem(h, elementList) {
  return elementList.map(scheme => {
    const config = scheme.__config__
    const layout = layouts[config.layout]
    if (layout) {
      return layout.call(this, h, scheme)
    }
    throw new Error(`没有与${config.layout}匹配的layout`)
  })
}
function renderChildren(h, scheme) {
  const config = scheme.__config__
  if (!Array.isArray(config.children)) return null
  return renderFormItem.call(this, h, config.children)
}
function setValue(event, config, scheme) {
  this.$set(config, 'defaultValue', event)
  this.$set(this[this.formConf.formModel], scheme.__vModel__, event)
}
function buildListeners(scheme) {
  const config = scheme.__config__
  const methods = this.formConf.__methods__ || {}
  const listeners = {}
  // 给__methods__中的方法绑定this和event
  Object.keys(methods).forEach(key => {
    listeners[key] = event => methods[key].call(this, event)
  })
  // 响应 render.js 中的 vModel $emit('input', val)
  listeners.input = event => {
    //将输入的金额格式化.
    let active = null;
    let isAmount = false;
    let end = null;
    let preventVal = event;
    if(this.formatAmounts.includes(scheme.__vModel__)){
      active = document.activeElement;
      end = (active && active.selectionEnd) | 0;
      isAmount = true;
      event = this.amountFormat(event,'input');
    }
    setValue.call(this, event, config, scheme)

    if(isAmount){
      this.$nextTick(() => {
        let newLen = event.length - preventVal.length;
        if(newLen === 1)  end = end+1;
        if(newLen === -1) end = end-1;
        if(active && active.tagName == 'INPUT'){  
          active.setSelectionRange&&active.setSelectionRange(end,end);
        }
      });
      isAmount =false;
    }
    this.doSomethingInput(
      event,
      scheme.__vModel__,
      this[this.formConf.formModel],
      scheme
    );
  }
  listeners.change = event => {
    setValue.call(this, event, config, scheme)
    this.doSomethingChange(
      event,
      scheme.__vModel__,
      this[this.formConf.formModel],
      scheme
    );
  }
  listeners.click1 = event => {
    // setValue.call(this, event, config, scheme)
    this.doSomething2(
      event,
      scheme.__vModel__,
      this[this.formConf.formModel],
      scheme
    );
  }
  listeners.otherClick = event => {
    // setValue.call(this, event, config, scheme)
    this.doSomethingother(
      event,
      scheme.__vModel__,
      this[this.formConf.formModel],
      scheme
    );
  }
  return listeners
}
export default {
  components: {
    render
  },
  props: {
    formConf: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      formConfCopy: deepClone(this.formConf),
      [this.formConf.formModel]: {},
      [this.formConf.formRules]: {},
      formatAmounts: [] //保存格式化金额的字段,在提交的时,去掉千位符.
    }
    //amount format
    this.initAmountFormat(data.formConfCopy.fields,data.formatAmounts);
    this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel])
    this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules])

    
    return data
  },
  methods: {
    DateDiff(sDate1, sDate2){    
          var  aDate,  oDate1,  oDate2,  iDays  
          aDate   =  sDate1.split("-")  
          oDate1 = new Date(aDate[0] , aDate[1] ,aDate[2])    //转换为12-18-2006格式  
          aDate   =  sDate2.split("-")  
          oDate2 = new Date(aDate[0] , aDate[1] , aDate[2])  
          iDays   =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数  
        return  iDays
    },
    doSomethingInput(data, model, value,codetype) {
      this.$emit("funcInput", data, model, value ,codetype);
    },
    doSomethingChange(data, model, value,codetype) {
      this.$emit("funcChange", data, model, value ,codetype);
    },
    doSomething2(data, model, value,codetype) {
      if(codetype.__config__.tagIcon == 'Customcodetable' || codetype.__config__.tagIcon === 'AssociatedProcess') {
        this.$emit("func", data, model, value ,codetype, 1);
      } else if(codetype.__config__.tagIcon == 'custom') {
        this.$emit("func", data, model, value ,codetype, 1);
      } else {
        this.$emit("func", data, model, value ,codetype, 2);
      }
    },
    doSomethingother(data, model, value,codetype) {
      this.$emit("funcOther", data, model, value ,codetype);
    },
    setcon(aValue, bValue, value ,codetype) {
      let config = codetype
      var that = this;
      if (codetype.hasOwnProperty('fun')) {
        var func = config.fun;
        var dom = new Function(`return ${func}`)();
        dom(value, this, config)
        // console.log(value)
        // console.log(this.DateDiff(value.m[0],value.m[1]))
        // console.log(codetype)
        // this.formConfCopy.fields.forEach(el => {
        //     if (el.__vModel__ === config.result) {
        //         this.$set(el.__config__, "defaultValue", dom(value));
        //         this.formData[config.result] = dom(value)
        //     }
        // });
      }
    },
    initAmountFormat(data,amounts) {
      data && data.forEach((val,i,arr) => {
          if(val.__config__.children){
            this.initAmountFormat(val.__config__.children);
          }
          if(val.isFormat === undefined){
            val.isFormat = false;
          }
          if(val.isFormat){
            let v = this.amountFormat(val.__config__.defaultValue,'show');
            val.__config__.defaultValue = v;
            //如果是不可编辑的,清空验证,否则加千位符金额验证.
            if(val.disabled){
              val.__config__.regList = [];
            }else{
              amounts.push(val.__vModel__);
              let conf = val.__config__.regList[0];
              val.__config__.regList = [{
                message: conf.message,
                pattern: '/^(([1-9][0-9]{0,2}(,\\d{3})*)|0)(\.\\d{1,2})?$/'
              }];
            }
          }
      });
    },
    initFormData(componentList, formData) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (cur.__vModel__) formData[cur.__vModel__] = config.defaultValue
        if (config.children) this.initFormData(config.children, formData)
      })
    },
    buildRules(componentList, rules) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (Array.isArray(config.regList)) {
          if (config.required) {
            const required = { required: config.required, message: cur.placeholder }
            if (Array.isArray(config.defaultValue)) {
              required.type = 'array'
              required.message = `请至少选择一个${config.label}`
            }
            required.message === undefined && (required.message = `${config.label}不能为空`)
            config.regList.push(required)
          }
          rules[cur.__vModel__] = config.regList.map(item => {
            item.pattern && (item.pattern = eval(item.pattern))
            item.trigger = ruleTrigger && ruleTrigger[config.tag]
            return item
          })
        }
        if (config.children) this.buildRules(config.children, rules)
      })
    },
    resetForm() {
      this.formConfCopy = deepClone(this.formConf)
      this.$refs[this.formConf.formRef].resetFields()
    },
    submitForm() {
      this.$refs[this.formConf.formRef].validate(valid => {
        if (!valid) return false
        //还原金额格式
        this.formatAmounts.forEach((v) =>{
          let amount = this[this.formConf.formModel][v];
          amount && (this[this.formConf.formModel][v] = amount.replace(/,/g,''));
        });
        // 触发sumit事件
        let arr =[]
        for (let i in this[this.formConf.formModel]) {
                  arr = i.split('-');             
                            }
        if(this[this.formConf.formModel][arr[0]+'-BL'] == 1){
            this[this.formConf.formModel][arr[0]+'-BUSI_NAME'] = this[this.formConf.formModel][arr[0]+'-BUSI_NAME']+'('+this.$t('initiateApplicationPage.BackTracking')+')'
        }
        this.$emit('submit', this[this.formConf.formModel])
        return true
      })
    },
    amountFormat(amount,type) { 
      
      let value = String(amount).replace(/,/g,'');
      let intREG = /^[0-9]+(\.\d{1,2})*$/g;
      if (!intREG.test(value)) return amount;
      let intPart = value.toString().split('.')[0] //获取整数部分
      let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
  
      let floatPart = ".00"; //预定义小数部分
      let value2Array = value.toString().split(".");

      //=2表示数据有小数位
      if(type === 'input'){
        let float = '';
        if (value2Array.length > 1) {
          float = '.'+value2Array[1].toString();
        }
        return intPartFormat+float;
      }
      if (value2Array.length == 2) {
          floatPart = value2Array[1].toString(); //拿到小数部分
          if(floatPart.length >2){
            return amount;
          }
          if (floatPart.length == 1) { //补0,实际上用不着
              return intPartFormat + "." + floatPart + '0';
          } else {
              return intPartFormat + "." + floatPart;
          }
      } else {
          return intPartFormat + floatPart;
      }
    },
  },
  render(h) {
    return renderFrom.call(this, h)
  }
}
</script>