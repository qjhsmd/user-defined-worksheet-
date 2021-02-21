<template>
  <div>
    <el-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose">
      <div style="height:100%">
        <el-row style="height:100%;overflow:auto">
          <el-col :md="24" :lg="12" class="left-editor">
            <div class="setting" :title="$t('FormDrawer.ResourceReference')" @click="showResource">
              <el-badge :is-dot="!!resources.length" class="item">
                <i class="el-icon-setting" />
              </el-badge>
            </div>
            <el-tabs v-model="activeTab" type="card" class="editor-tabs">
              <el-tab-pane name="html">
                <span slot="label">
                  <i v-if="activeTab==='html'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  template
                </span>
              </el-tab-pane>
              <el-tab-pane name="js">
                <span slot="label">
                  <i v-if="activeTab==='js'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  script
                </span>
              </el-tab-pane>
              <el-tab-pane name="css">
                <span slot="label">
                  <i v-if="activeTab==='css'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  css
                </span>
              </el-tab-pane>
            </el-tabs>
            <div v-show="activeTab==='html'" id="editorHtml" class="tab-editor" />
            <div v-show="activeTab==='js'" id="editorJs" class="tab-editor" />
            <div v-show="activeTab==='css'" id="editorCss" class="tab-editor" />
          </el-col>
          <el-col :md="24" :lg="12" class="right-preview">
            <div class="action-bar" :style="{'text-align': 'left'}">
              <span class="bar-btn" @click="runCode">
                <i class="el-icon-refresh" />
                {{$t('FormDrawer.Refresh')}}
              </span>
              <span class="bar-btn" @click="exportFile">
                <i class="el-icon-download" />
                {{$t('FormDrawer.ExportVuefile')}}
              </span>
              <span ref="copyBtn" class="bar-btn copy-btn">
                <i class="el-icon-document-copy" />
                 {{$t('FormDrawer.CopyCode')}}
              </span>
              <span class="bar-btn delete-btn" @click="$emit('update:visible', false)">
                <i class="el-icon-circle-close" />
                   {{$t('FormDrawer.close')}}
              </span>
            </div>
            <iframe
              v-show="isIframeLoaded"
              ref="previewPage"
              class="result-wrapper"
              frameborder="0"
              src="preview.html"
              @load="iframeLoad"
            />
            <div v-show="!isIframeLoaded" v-loading="true" class="result-wrapper" />
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <resource-dialog
      :visible.sync="resourceVisible"
      :origin-resource="resources"
      @save="setResource"
    />
  </div>
</template>
<script>
import { parse } from '@babel/parser'
import ClipboardJS from 'clipboard'
import { saveAs } from 'file-saver'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import { exportDefault, beautifierConf, titleCase } from '@/utils/index'
import ResourceDialog from './ResourceDialog'
import loadMonaco from '@/utils/loadMonaco'
import loadBeautifier from '@/utils/loadBeautifier'

const editorObj = {
  html: null,
  js: null,
  css: null
}
const mode = {
  html: 'html',
  js: 'javascript',
  css: 'css'
}
let beautifier
let monaco

export default {
  components: { ResourceDialog },
  props: ['formData', 'generateConf'],
  data() {
    return {
      activeTab: 'html',
      htmlCode: '',
      jsCode: '',
      cssCode: '',
      codeFrame: '',
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      isRefreshCode: false, // 每次打开都需要重新刷新代码
      resourceVisible: false,
      scripts: [],
      links: [],
      monaco: null
    }
  },
  computed: {
    resources() {
      return this.scripts.concat(this.links)
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    window.addEventListener('keydown', this.preventDefaultSave)
    const clipboard = new ClipboardJS('.copy-btn', {
      text: trigger => {
        const codeStr = this.generateCode()
        this.$notify({
          title: this.$t('FormDrawer.success'),
          message: this.$t('FormDrawer.copysuccesstips'),
          type: 'success'
        })
        return codeStr
      }
    })
    clipboard.on('error', e => {
      this.$message.error(this.$t('FormDrawer.copyerrortips'))
    })
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.preventDefaultSave)
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
      }
    },
    onOpen() {
      const { type } = this.generateConf
      this.htmlCode = makeUpHtml(this.formData, type)
      this.jsCode = makeUpJs(this.formData, type)
      this.cssCode = makeUpCss(this.formData)
      loadBeautifier(btf => {
        beautifier = btf
        this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html)
        this.jsCode = beautifier.js(this.jsCode, beautifierConf.js)
        this.cssCode = beautifier.css(this.cssCode, beautifierConf.html)
        loadMonaco(val => {
          monaco = val
          this.setEditorValue('editorHtml', 'html', this.htmlCode)
          this.setEditorValue('editorJs', 'js', this.jsCode)
          this.setEditorValue('editorCss', 'css', this.cssCode)
          if (!this.isInitcode) {
            this.isRefreshCode = true
            this.isIframeLoaded && (this.isInitcode = true) && this.runCode()
          }
        })
      })
    },
    onClose() {
      this.isInitcode = false
      this.isRefreshCode = false
      this.isIframeLoaded = false
    },
    iframeLoad() {
      if (!this.isInitcode) {
        this.isIframeLoaded = true
        this.isRefreshCode && (this.isInitcode = true) && this.runCode()
      }
    },
    setEditorValue(id, type, codeStr) {
      if (editorObj[type]) {
        editorObj[type].setValue(codeStr)
      } else {
        editorObj[type] = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: mode[type],
          automaticLayout: true
        })
      }
      editorObj[type].onKeyDown(e => {
        if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
          this.runCode()
        }
      })
    },
    runCode() {
      const jsCodeStr = editorObj.js.getValue()
      try {
        const ast = parse(jsCodeStr, { sourceType: 'module' })
        const astBody = ast.program.body
        if (astBody.length > 1) {
          this.$confirm(
            this.$t('FormDrawer.RecognitionTips'),
            this.$t('FormDrawer.Tips'),
            { 
              confirmButtonText:this.$t('FormDrawer.confirm'),
              cancelButtonText: this.$t('FormDrawer.cancel'),
              type: 'warning'
            }
          )
          return
        }
        if (astBody[0].type === 'ExportDefaultDeclaration') {
          const postData = {
            type: 'refreshFrame',
            data: {
              generateConf: this.generateConf,
              html: editorObj.html.getValue(),
              js: jsCodeStr.replace(exportDefault, ''),
              css: editorObj.css.getValue(),
              scripts: this.scripts,
              links: this.links
            }
          }

          this.$refs.previewPage.contentWindow.postMessage(
            postData,
            location.origin
          )
        } else {
          this.$message.error(this.$t('FormDrawer.pleaseUse')+'export default')
        }
      } catch (err) {
        this.$message.error('js'+this.$t('FormDrawer.error')+':'`${err}`)
        console.error(err)
      }
    },
    generateCode() {
      const html = vueTemplate(editorObj.html.getValue())
      const script = vueScript(editorObj.js.getValue())
      const css = cssStyle(editorObj.css.getValue())
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    exportFile() {
      this.$prompt(this.$t('FormDrawer.fieldName')+':', this.$t('FormDrawer.exportField'), {
        inputValue: `${+new Date()}.vue`,
        closeOnClickModal: false,
        confirmButtonText: this.$t('FormDrawer.confirm'),
        cancelButtonText: this.$t('FormDrawer.cancel'),
        inputPlaceholder: this.$t('FormDrawer.enterFieldTip')
      }).then(({ value }) => {
        if (!value) value = `${+new Date()}.vue`
        const codeStr = this.generateCode()
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, value)
      })
    },
    showResource() {
      this.resourceVisible = true
    },
    setResource(arr) {
      const scripts = []; const
        links = []
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.endsWith('.css')) {
            links.push(item)
          } else {
            scripts.push(item)
          }
        })
        this.scripts = scripts
        this.links = links
      } else {
        this.scripts = []
        this.links = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
