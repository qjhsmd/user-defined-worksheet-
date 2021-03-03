let a = "BUSI_M_SYSTEM_CBBCF_CCYSQ25-SQJE" // 请款 申请金额
let b = "BUSI_M_SYSTEM_CBBCF_CCYSQ25-KYYE" // 请款 可用余额
that.rules[a].push(
  {
    validator: (rule, val, callback) => {
      const pattern = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
      if (!pattern.test(val)) {
        callback(new Error(that.$t('initiateApplicationPage.amountPattern')))
      }
      if (Number(val) > Number(value[b])) {
        callback(new Error(that.$t('initiateApplicationPage.amountPattern1')))
      } else {
        callback()
      }
    },
    trigger: 'change',
    required: true
  }
)
that.formConfCopy.fields.forEach((el) => {
  if (el.__vModel__ === a) {
    that.$refs.elForm.validateField(a);
  }
});

//  验证 预申请币种一致
that.formConfCopy.fields.forEach((el) => {
  let a = "BUSI_M_SYSTEM_CBBCF_CCYSQ25-SQJE" // 请款 币种 字段
  let b = "BUSI_M_SYSTEM_CBBCF_CCYSQ25-KYYE" // 预申请 币种 字段
  if (el.__vModel__ === a) {
    if ((value[a]) != (value[b])) {
      that.rules[a].push(
        {
          validator: (rule, val, callback) => {
            if (Number(val) != Number(value[b])) {
              callback(new Error(that.$t('initiateApplicationPage.currencyInfo')))
            } else {
              callback()
            }
          },
          trigger: 'change',
          required: true
        }
      )
      that.$refs.elForm.validateField(a);
    }
  }
});

//  验证 费用类型 一致 
that.formConfCopy.fields.forEach((el) => {
  let a = "BUSI_M_SYSTEM_CBBCF_CCYSQ25-SQJE" // 请款 费用类型 字段
  let b = "BUSI_M_SYSTEM_CBBCF_CCYSQ25-KYYE" // 预申请 费用类型 字段
  if (el.__vModel__ === a) {
    if ((value[a]) != (value[b])) {
      that.rules[a].push(
        {
          validator: (rule, val, callback) => {
            if (Number(val) != Number(value[b])) {
              callback(new Error(that.$t('initiateApplicationPage.expenseTypeInfo')))
            } else {
              callback()
            }
          },
          trigger: 'change',
          required: true
        }
      )
      that.$refs.elForm.validateField(a);
    }
  }
});

//  算出明细表 一条数据的总金额

that.formConfCopy.fields.forEach(el => {
  if (el.__config__.hasOwnProperty('children')) {
    el.__config__.children.forEach(item => {
      if (item.__vModel__ === 'ZJ') {
        that.$set(item.__config__, 'defaultValue', Number(value['SL']) * Number(value['DJ']));
        that.formData['ZJ'] = Number(value['SL']) * Number(value['DJ']);
      }
    })
  }
});