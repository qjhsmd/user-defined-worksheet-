that.rules["BUSI_M_SYSTEM_CBBCF_CCYSQ25-SQJE"].push(
    {
    validator: (rule, val, callback) => {
      const pattern = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
      if(! pattern.test(val) ){
         callback(new Error(that.$t('initiateApplicationPage.amountPattern')))
      }
      if(Number(val) > Number(value["BUSI_M_SYSTEM_CBBCF_CCYSQ25-KYYE"])) {
      callback(new Error(that.$t('initiateApplicationPage.amountPattern1')))
      }  else {
        callback()
      }
    },
    trigger: 'change',
    required: true
  }
  )
that.formConfCopy.fields.forEach((el) => {
if ( el.__vModel__ === "BUSI_M_SYSTEM_CBBCF_CCYSQ25-SQJE" ) {
  that.$refs.elForm.validateField('BUSI_M_SYSTEM_CBBCF_CCYSQ25-SQJE');
}
});