<template>
  <div>
    <el-drawer
      v-bind="$attrs"
      v-on="$listeners"
      @opened="onOpen"
      @close="onClose"
    >
      <div class="action-bar" :style="{ 'text-align': 'left' }">
        <span class="bar-btn" @click="refresh">
          <i class="el-icon-refresh" />
          {{$t('JsonDrawer.Refresh')}}
        </span>
        <span ref="copyBtn" class="bar-btn copy-json-btn">
          <i class="el-icon-document-copy" />
           {{$t('JsonDrawer.copyJSON')}}
        </span>
        <span class="bar-btn" @click="exportJsonFile">
          <i class="el-icon-download" />
         {{$t('JsonDrawer.exportJSON')}}
        </span>
        <span
          class="bar-btn delete-btn"
          @click="$emit('update:visible', false)"
        >
          <i class="el-icon-circle-close" />
          {{$t('JsonDrawer.close')}}
        </span>
      </div>
      <div id="editorJson" class="json-editor" />
    </el-drawer>
  </div>
</template>

<script>
import { beautifierConf } from "@/utils/index";
import ClipboardJS from "clipboard";
import { saveAs } from "file-saver";
import loadMonaco from "@/utils/loadMonaco";
import loadBeautifier from "@/utils/loadBeautifier";

let beautifier;
let monaco;

export default {
  components: {},
  props: {
    jsonStr: {
      type: String,
      required: true,
      beautifier: null,
      jsonEditor: null
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    window.addEventListener("keydown", this.preventDefaultSave);
    const clipboard = new ClipboardJS(".copy-json-btn", {
      text: trigger => {
        this.$notify({
          title: this.$t('JsonDrawer.success'),
          message:  this.$t('JsonDrawer.copysuccesstips'),
          type: "success"
        });
        return this.beautifierJson;
      }
    });
    clipboard.on("error", e => {
      this.$message.error(this.$t('JsonDrawer.copyerrortips'));
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.preventDefaultSave);
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
    },
    onOpen() {
      loadBeautifier(btf => {
        beautifier = btf;
        this.beautifierJson = beautifier.js(this.jsonStr, beautifierConf.js);

        loadMonaco(val => {
          monaco = val;
          this.setEditorValue("editorJson", this.beautifierJson);
        });
      });
    },
    onClose() {},
    setEditorValue(id, codeStr) {
      if (this.jsonEditor) {
        this.jsonEditor.setValue(codeStr);
      } else {
        this.jsonEditor = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: "vs-dark",
          language: "json",
          automaticLayout: true
        });
        // ctrl + s 刷新
        this.jsonEditor.onKeyDown(e => {
          if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
            this.refresh();
          }
        });
      }
    },
    exportJsonFile() {
      this.$prompt(this.$t('JsonDrawer.fieldName')+":", this.$t('JsonDrawer.exportField'), {
        inputValue: `${+new Date()}.json`,
        closeOnClickModal: false,
        confirmButtonText: this.$t('JsonDrawer.confirm'),
        cancelButtonText: this.$t('JsonDrawer.cancel'),
        inputPlaceholder: this.$t('JsonDrawer.enterFieldTip')
      }).then(({ value }) => {
        if (!value) value = `${+new Date()}.json`;
        const codeStr = this.jsonEditor.getValue();
        const blob = new Blob([codeStr], { type: "text/plain;charset=utf-8" });
        saveAs(blob, value);
      });
    },
    refresh() {
      try {
        this.$emit("refresh", JSON.parse(this.jsonEditor.getValue()));
      } catch (error) {
        this.$notify({
          title:this.$t('JsonDrawer.error'),
          message: this.$t('JsonDrawer.JSONerror'),
          type: "error"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header {
  display: none;
}

.json-editor {
  height: calc(100vh - 33px);
}
</style>
