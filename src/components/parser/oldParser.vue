<script>
import render from "@/components/render/render.js";

const ruleTrigger = {
  "el-input": "blur",
  "el-input-number": "blur",
  "el-select": "change",
  "el-radio-group": "change",
  "el-checkbox-group": "change",
  "el-cascader": "change",
  "el-time-picker": "change",
  "el-date-picker": "change",
  "el-rate": "change"
};

function renderFrom(h) {
  const { formConfCopy } = this;
  return (
    <el-row gutter={formConfCopy.gutter}>
      <el-form
        size={formConfCopy.size}
        label-position={formConfCopy.labelPosition}
        disabled={formConfCopy.disabled}
        label-width={`${formConfCopy.labelWidth}px`}
        ref={formConfCopy.formRef}
        props={{ model: this[formConfCopy.formModel] }}
        rules={this[formConfCopy.formRules]}
      >
        {renderFormItem.call(this, h, formConfCopy.fields)}
      </el-form>
    </el-row>
  );
}
function renderFormItem(h, elementList) {
  return elementList.map(scheme => {
    const config = scheme.__config__;
    const layout = layouts[config.layout];
    if (layout) {
      return layout.call(this, h, scheme);
    }
    throw new Error(`没有与${config.layout}匹配的layout`);
  });
}

function renderChildren(h, scheme) {
  const config = scheme.__config__;
  if (!Array.isArray(config.children)) return null;
  return renderFormItem.call(this, h, config.children);
}

const layouts = {
  colFormItem(h, scheme) {
    const config = scheme.__config__;
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = "0";
    return (
      <el-col span={config.span}>
        <el-form-item
          label-width={labelWidth}
          prop={scheme.__vModel__}
          label={config.showLabel ? config.label : ""}
        >
         
          <render
            conf={scheme}
            {
              ...{
                nativeOn: {
                  click: ($event) => {
                    this.doSomething2(
                      $event.data,
                      scheme.__vModel__,
                      this[this.formConf.formModel],
                      scheme.__config__.tagIcon
                    );
                  },
                  "change": ($event) => {
                    this.$set(config, "defaultValue", $event.data);
                    this.$set(
                      this[this.formConf.formModel],
                      scheme.__vModel__,
                      $event.data
                    );
                    this.doSomethingChange(
                      $event.data,
                      scheme.__vModel__,
                      this[this.formConf.formModel],
                      scheme
                    );
                  },
                  "input": ($event) => {
                    // this.$set(config, "defaultValue", $event.data);
                    // this.$set(
                    //   this[this.formConf.formModel],
                    //   scheme.__vModel__,
                    //   $event.data
                    // );
                    // this.doSomethingInput(
                    //   $event.data,
                    //   scheme.__vModel__,
                    //   this[this.formConf.formModel],
                    //   scheme
                    // );
                  }
                }
              }
            }
            // nativeOn: { // <render conf={scheme} {...{ on: listeners }} />
            //   Click: (evemt) => {
            //     this.doSomething2(
            //       event,
            //       scheme.__vModel__,
            //       this[this.formConf.formModel],
            //       scheme.__config__.tagIcon
            //     );
            //   }
            // }
            // onChange={event => {
            //   this.$set(config, "defaultValue", event);
            //   this.$set(
            //     this[this.formConf.formModel],
            //     scheme.__vModel__,
            //     event
            //   );
            //   this.doSomethingChange(
            //     event,
            //     scheme.__vModel__,
            //     this[this.formConf.formModel],
            //     scheme
            //   );
            // }}
            // onInput={event => {
            //   this.$set(config, "defaultValue", event);
            //   this.$set(
            //     this[this.formConf.formModel],
            //     scheme.__vModel__,
            //     event
            //   );
            //   this.doSomethingInput(
            //     event,
            //     scheme.__vModel__,
            //     this[this.formConf.formModel],
            //     scheme
            //   );
            // }}
            // onClick={event => {
            //   this.doSomething2(
            //     event,
            //     scheme.__vModel__,
            //     this[this.formConf.formModel],
            //     scheme.__config__.tagIcon
            //   );
            // }}
          />
        </el-form-item>
      </el-col>
    );
  },
  rowFormItem(h, scheme) {
    let child = renderChildren.apply(this, arguments);
    if (scheme.type === "flex") {
      child = (
        <el-row
          type={scheme.type}
          justify={scheme.justify}
          align={scheme.align}
          label={scheme.__config__.label}
        >
          {child}
        </el-row>
      );
    }
    return (
      <el-col span={scheme.span}>
        <el-row gutter={scheme.gutter}>{child}</el-row>
      </el-col>
    );
  }
};

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
      formConfCopy: JSON.parse(JSON.stringify(this.formConf)),
      [this.formConf.formModel]: {},
      [this.formConf.formRules]: {}
    };
    this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel]);
    this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules]);
    return data;
  },
  methods: {
    doSomethingChange(data, model, value,codetype) {
      this.$emit("funcChange", data, model, value ,codetype);
    },
    doSomethingInput(data, model, value,codetype) {
      this.$emit("funcInput", data, model, value ,codetype);
    },
    doSomething2(data, model, value,codetype) {
      this.$emit("func", data, model, value ,codetype);
    },
    DateDiff(sDate1, sDate2){    
          var  aDate,  oDate1,  oDate2,  iDays  
          aDate   =  sDate1.split("-")  
          oDate1 = new Date(aDate[0] , aDate[1] ,aDate[2])    //转换为12-18-2006格式  
          aDate   =  sDate2.split("-")  
          oDate2 = new Date(aDate[0] , aDate[1] , aDate[2])  
          iDays   =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数  
        return  iDays
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
    initFormData(componentList, formData) {
      componentList.forEach(cur => {
        const config = cur.__config__;
        if (cur.__vModel__) formData[cur.__vModel__] = config.defaultValue;
        if (config.children) this.initFormData(config.children, formData);
      });
    },
    buildRules(componentList, rules) {
      componentList.forEach(cur => {
        const config = cur.__config__;
        if (Array.isArray(config.regList)) {
          if (config.required) {
            const required = {
              required: config.required,
              message: cur.placeholder
            };
            if (Array.isArray(config.defaultValue)) {
              required.type = "array";
              required.message = `请至少选择一个${config.label}`;
            }
            required.message === undefined &&
              (required.message = `${config.label}不能为空`);
            config.regList.push(required);
          }
          rules[cur.__vModel__] = config.regList.map(item => {
            item.pattern && (item.pattern = eval(item.pattern));
            item.trigger = ruleTrigger && ruleTrigger[config.tag];
            return item;
          });
        }
        if (config.children) this.buildRules(config.children, rules);
      });
    },
    resetForm() {
      this.formConfCopy = JSON.parse(JSON.stringify(this.formConf));
      this.$refs[this.formConf.formRef].resetFields();
    },
    submitForm() {
      this.$refs[this.formConf.formRef].validate(valid => {
        if (!valid) return false;
        // 触发sumit事件
        this.$emit("submit", this[this.formConf.formModel]);
        return true;
      });
    }
  },
  render(h) {
    return renderFrom.call(this, h);
  }
};
</script>
<style scoped>
.fms-button {
  text-align: center;
  margin-top: 30px;
  width: 100%;
}
</style>
