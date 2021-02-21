function vModel(self, dataObject, defaultValue) {
  dataObject.props.value = defaultValue

  dataObject.on.input = val => {
    self.$emit('input', val)
  }
  dataObject.on.change = val => {
    self.$emit('change', val)
  }
  // dataObject.nativeOn = {
  //   'click': (val) => {
  //     self.$emit('click', val)
  //   }
  // }
}
function doSomething(self, dataObject, val,codetype) {
  delete dataObject.nativeOn.click;
  dataObject.nativeOn = {
    'click': () => {
      self.$emit('click1', val, dataObject,codetype)
    },
  }
}
function otherDoSomething(self, dataObject, val,codetype) {
  delete dataObject.nativeOn.click;
  dataObject.nativeOn = {
    'click': () => {
      self.$emit('otherClick', val, dataObject,codetype)
    },
  }
}

const componentChild = {}
/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const slotsFiles = require.context('./slots', true, /\.js$/)
const keys = slotsFiles.keys() || []
keys.forEach(key => {
  const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = slotsFiles(key).default
  componentChild[tag] = value
})

export default {
  render(h) {
    const dataObject = {
      attrs: {},
      props: {},
      on: {},
      style: {},
      nativeOn: {}
    }
    const confClone = JSON.parse(JSON.stringify(this.conf))
    const children = []

    const childObjs = componentChild[confClone.__config__.tag]
    if (childObjs) {
      Object.keys(childObjs).forEach(key => {
        const childFunc = childObjs[key]
        if (confClone.__slot__ && confClone.__slot__[key]) {
          children.push(childFunc(h, confClone, key))
        }
      })
    }

    Object.keys(confClone).forEach(key => {
      const val = confClone[key]
      if(key == '__config__') {
        if(val.tagIcon == 'Customcodetable') {
          doSomething(this, dataObject,val,'codeTableId')
        } else if(val.tagIcon == 'custom') {
          doSomething(this, dataObject,confClone['cFun'],'codeTableId')
        } else {
          doSomething(this, dataObject,val, 'other')
        }
      }
      if (key === 'cFun' ) {
        // doSomething(this, dataObject, val)
        // callfn('doSomething', this, dataObject)
        // doSomething()
        // eval(val)
        // eval(val+"(this, dataObject)")
      }else if( key === 'codeTableId' ){
        // doSomething(this, dataObject,val,'codeTableId')
      } else {
        // otherDoSomething(this, dataObject,val)
        if (key === '__vModel__') {

          vModel(this, dataObject, confClone.__config__.defaultValue)
        } else if (dataObject[key]) {
          dataObject[key] = { ...dataObject[key], ...val }
        } else {
          dataObject.attrs[key] = val
        }
      }
    })
    delete dataObject.attrs.__config__
    delete dataObject.attrs.__slot__
    return h(this.conf.__config__.tag, dataObject, children)
  },
  props: ['conf']
}
