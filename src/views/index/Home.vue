<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper"></div>
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <div class="components-title">
              <svg-icon icon-class="component" />
              {{ $t(item.title) }}
            </div>

            <draggable
              class="components-draggable"
              :list="item.list"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
              :clone="cloneComponent"
              draggable=".components-item"
              :sort="false"
              @end="onEnd"
            >
              <div
                v-for="(element, index) in item.list"
                :key="index"
                class="components-item"
                @click="addComponent(element)"
              >
                <div class="components-body">
                  <svg-icon
                    v-if="element.__config__.tagIcon == 'Customcodetable'"
                    icon-class="user"
                  />
                  <svg-icon v-else :icon-class="element.__config__.tagIcon" />
                  {{ element.__config__.label }}
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <div class="action-bar">
        <!-- <el-button icon="el-icon-video-play" type="text" @click="getFormData">
          运行
                </el-button>-->
        <!-- <el-button icon="el-icon-video-play" type="text" @click="run">
          预览
                </el-button> -->

        <el-button icon="el-icon-view" type="text" @click="showJson">
          查看json
        </el-button>
        <!-- <el-button icon="el-icon-download" type="text" @click="download">
          导出vue文件
                </el-button>-->
        <!-- <el-button
          class="copy-btn-main"
          icon="el-icon-document-copy"
          type="text"
          @click="copy"
        >
          复制代码
                </el-button>-->
        <slot name="submit" style="margin-left: -20px"></slot>
      </div>
      <el-scrollbar class="center-scrollbar">
        <el-row
          v-if="showTime"
          class="center-board-row"
          :gutter="formConf.gutter"
        >
          <el-form
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
          >
            <draggable
              class="drawing-board"
              :list="drawingList"
              :animation="340"
              group="componentsGroup"
            >
              <!--  -->
              <draggable-item
                v-for="(element, index) in drawingList"
                :key="element.renderKey"
                :drawing-list="drawingList"
                :element="element"
                :index="index"
                :active-id="activeId"
                :form-conf="formConf"
                @activeItem="activeFormItem"
                @copyItem="drawingItemCopy"
                @deleteItem="drawingItemDelete"
              />
            </draggable>
            <div v-show="!drawingList.length" class="empty-info">
              {{ $t("home.designtip") }}
            </div>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>
    <div v-if="rightPanel">
      <right-panel
        :active-data="activeData"
        :form-conf="formConf"
        :drawingList="drawingList"
        :show-field="!!drawingList.length"
        @tag-change="tagChange"
        :formData="formData"
        :codeDataOptions="codeDataOptions"
        @AssembleFormData="AssembleFormData"
        :codeModelOptions="codeModelOptions"
        :codeNameOptions="codeNameOptions"
        :processOptions="processOptions"
        :options="fieldName"
        :clickName="clickName"
        :codeList="codeList"
        @changeField="changeField"
        :detailFields="detailFields"
        :onlyDetail="onlyDetail"
        ref="myRight"
      />
    </div>
    <form-drawer
      :visible.sync="drawerVisible"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    />
    <json-drawer
      size="60%"
      :visible.sync="jsonDrawerVisible"
      :json-str="JSON.stringify(formData)"
      @refresh="refreshJson"
    />
    <code-type-dialog
      :visible.sync="dialogVisible"
      :title="$t('home.selectType')"
      :show-file-name="showFileName"
      @confirm="generate"
    />
    <input id="copyNode" type="hidden" />
  </div>
</template>

<script>
import "../../icons";
import "../../assets/index.scss";
import draggable from "vuedraggable";
import { debounce } from "throttle-debounce";
import { saveAs } from "file-saver";
import ClipboardJS from "clipboard";
import render from "@/components/render/render";
import FormDrawer from "./FormDrawer";
import JsonDrawer from "./JsonDrawer";
import RightPanel from "./RightPanel";
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  formConf,
} from "@/components/generator/config";
import {
  exportDefault,
  beautifierConf,
  isNumberStr,
  titleCase,
} from "@/utils/index";
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle,
} from "@/components/generator/html";
import { makeUpJs } from "@/components/generator/js";
import { makeUpCss } from "@/components/generator/css";
import drawingDefalut from "@/components/generator/drawingDefalut";
import logo from "@/assets/logo.png";
import CodeTypeDialog from "./CodeTypeDialog";
import DraggableItem from "./DraggableItem";
import {
  saveDrawingList,
  getIdGlobal,
  saveIdGlobal,
  getFormConf,
} from "@/utils/db";
import loadBeautifier from "@/utils/loadBeautifier";
// import jsonData from "../default";

let beautifier;
const emptyActiveData = { style: {}, autosize: {} };
let oldActiveId;
let tempActiveData;
const formConfInDB = getFormConf();
const idGlobal = getIdGlobal();

export default {
  components: {
    draggable,
    render,
    FormDrawer,
    JsonDrawer,
    RightPanel,
    CodeTypeDialog,
    DraggableItem,
  },
  props: [
    "jsonData",
    "fieldName",
    "clickName",
    "codeList",
    "detailFields",
    "baseUrl",
    "language",
    "token",
    "codeNameOptions",
    "processOptions",
    "codeModelOptions",
    "codeDataOptions",
  ],
  computed: {
    leftComponents: function () {
      return [
        {
          title: "home.InputTypeComponents",
          list: [
            {
              // 组件的自定义配置
              __config__: {
                label: this.$t("generator.SinglelineText"),
                labelWidth: null,
                showLabel: true,
                changeTag: true,
                tag: "el-input",
                tagIcon: "input",
                defaultValue: undefined,
                required: true,
                layout: "colFormItem",
                span: 20,
                showInput:true,
                document: "https://element.eleme.cn/#/zh-CN/component/input",
                // 正则校验规则
                regList: [],
              },
              // 组件的插槽属性
              __slot__: {
                prepend: "",
                append: "",
              },
              __vModel__: null,
              // 其余的为可直接写在组件标签上的属性
              placeholder: this.$t("generator.enterTip"),
              style: { width: "100%" },
              clearable: true,
              "prefix-icon": "",
              "suffix-icon": "",
              maxlength: null,
              "show-word-limit": false,
              readonly: false,
              disabled: false,
              isFormat: false,
            },
            {
              __config__: {
                label: this.$t("generator.MultilineText"),
                labelWidth: null,
                showLabel: true,
                tag: "el-input",
                tagIcon: "textarea",
                defaultValue: undefined,
                required: true,
                layout: "colFormItem",
                span: 20,
                regList: [],
                changeTag: true,
                document: "https://element.eleme.cn/#/zh-CN/component/input",
              },
              __vModel__: null,
              type: "textarea",
              placeholder: this.$t("generator.enterTip"),
              autosize: {
                minRows: 4,
                maxRows: 4,
              },
              style: { width: "100%" },
              maxlength: null,
              "show-word-limit": false,
              readonly: false,
              disabled: false,
            },
          ],
        },
        {
          title: "home.selectComponents",
          list: [
            {
              __config__: {
                label: this.$t("generator.DropDownSelection"),
                showLabel: true,
                labelWidth: null,
                tag: "el-select",
                tagIcon: "select",
                defaultValue: undefined,
                layout: "colFormItem",
                span: 20,
                required: true,
                regList: [],
                changeTag: true,
                document: "https://element.eleme.cn/#/zh-CN/component/select",
              },
              __vModel__: null,
              __slot__: {
                options: [
                  {
                    label: this.$t("generator.Option") + "1",
                    value: 1,
                  },
                  {
                    label: this.$t("generator.Option") + "2",
                    value: 2,
                  },
                ],
              },
              placeholder: this.$t("generator.selectTip"),
              style: { width: "100%" },
              clearable: true,
              disabled: false,
              filterable: false,
              multiple: false,
            },
            {
              __config__: {
                label: this.$t("generator.CascadeSelection"),
                showLabel: true,
                labelWidth: null,
                tag: "el-cascader",
                tagIcon: "cascader",
                layout: "colFormItem",
                defaultValue: [],
                dataType: "dynamic",
                span: 20,
                required: true,
                regList: [],
                changeTag: true,
                document: "https://element.eleme.cn/#/zh-CN/component/cascader",
              },
              __vModel__: null,
              options: [
                {
                  id: 1,
                  value: 1,
                  label: this.$t("generator.Option") + "1",
                  children: [
                    {
                      id: 2,
                      value: 2,
                      label: this.$t("generator.Option") + "1-1",
                    },
                  ],
                },
              ],
              placeholder: this.$t("generator.selectTip"),
              style: { width: "100%" },
              props: {
                props: {
                  multiple: false,
                  label: "label",
                  value: "value",
                  children: "children",
                },
              },
              "show-all-levels": true,
              disabled: false,
              clearable: true,
              filterable: false,
              separator: "/",
            },
            {
              __config__: {
                label: this.$t("generator.RadioBoxGroup"),
                labelWidth: null,
                showLabel: true,
                tag: "el-radio-group",
                tagIcon: "radio",
                changeTag: true,
                defaultValue: undefined,
                layout: "colFormItem",
                span: 20,
                optionType: "default",
                regList: [],
                required: true,
                border: false,
                document: "https://element.eleme.cn/#/zh-CN/component/radio",
              },

              __slot__: {
                options: [
                  {
                    label: this.$t("generator.Option") + "1",
                    value: 1,
                  },
                  {
                    label: this.$t("generator.Option") + "2",
                    value: 2,
                  },
                ],
              },
              style: {},
              size: "medium",
              disabled: false,
              __vModel__: null,
            },
            {
              __config__: {
                label: this.$t("generator.MultiBoxGroup"),
                tag: "el-checkbox-group",
                tagIcon: "checkbox",
                defaultValue: [],
                span: 20,
                showLabel: true,
                labelWidth: null,
                layout: "colFormItem",
                optionType: "default",
                required: true,
                regList: [],
                changeTag: true,
                border: false,
                document: "https://element.eleme.cn/#/zh-CN/component/checkbox",
              },
              __vModel__: null,
              __slot__: {
                options: [
                  {
                    label: this.$t("generator.Option") + "1",
                    value: 1,
                  },
                  {
                    label: this.$t("generator.Option") + "2",
                    value: 2,
                  },
                  {
                    label: this.$t("generator.Option") + "3",
                    value: 3,
                  },
                ],
              },
              style: {},
              size: "medium",
              min: null,
              max: null,
              disabled: false,
            },
            {
              __config__: {
                label: this.$t("generator.switch"),
                tag: "el-switch",
                tagIcon: "switch",
                defaultValue: false,
                span: 20,
                showLabel: true,
                labelWidth: null,
                layout: "colFormItem",
                required: true,
                regList: [],
                changeTag: true,
                document: "https://element.eleme.cn/#/zh-CN/component/switch",
              },
              __vModel__: null,
              style: {},
              disabled: false,
              "active-text": "",
              "inactive-text": "",
              "active-color": null,
              "inactive-color": null,
              "active-value": true,
              "inactive-value": false,
            },
            {
              __config__: {
                label: this.$t("generator.timePicker"),
                tag: "el-time-picker",
                tagIcon: "time",
                defaultValue: null,
                span: 20,
                showLabel: true,
                layout: "colFormItem",
                labelWidth: null,
                required: true,
                regList: [],
                changeTag: true,
                document:
                  "https://element.eleme.cn/#/zh-CN/component/time-picker",
              },
              __vModel__: null,
              placeholder: this.$t("generator.selectTip"),
              style: { width: "100%" },
              disabled: false,
              clearable: true,
              "picker-options": {
                selectableRange: "00:00:00-23:59:59",
              },
              format: "HH:mm",
              "value-format": "HH:mm",
            },
            {
              __config__: {
                label: this.$t("generator.timeRanges"),
                tag: "el-time-picker",
                tagIcon: "time-range",
                span: 20,
                showLabel: true,
                labelWidth: null,
                layout: "colFormItem",
                defaultValue: null,
                required: true,
                regList: [],
                changeTag: true,
                document:
                  "https://element.eleme.cn/#/zh-CN/component/time-picker",
              },
              __vModel__: null,
              style: { width: "100%" },

              disabled: false,
              clearable: true,
              "is-range": true,
              "range-separator": this.$t("generator.to"),
              "start-placeholder": this.$t("generator.startTime"),
              "end-placeholder": this.$t("generator.endTime"),
              format: "HH:mm",
              "value-format": "HH:mm",
            },

            {
              __config__: {
                label: this.$t("generator.DatePicker"),
                tag: "el-date-picker",
                tagIcon: "date",
                defaultValue: null,
                showLabel: true,
                labelWidth: null,
                span: 20,
                layout: "colFormItem",
                required: true,
                regList: [],
                changeTag: true,
                document:
                  "https://element.eleme.cn/#/zh-CN/component/date-picker",
              },
              __vModel__: null,
              placeholder: this.$t("generator.selectTip"),
              type: "date",
              style: { width: "100%" },
              disabled: false,
              clearable: true,
              format: "yyyy-MM-dd",
              "value-format": "yyyy-MM-dd",
              readonly: false,
            },
            {
              __config__: {
                label: this.$t("generator.dateRange"),
                tag: "el-date-picker",
                tagIcon: "date-range",
                defaultValue: null,
                span: 20,
                showLabel: true,
                labelWidth: null,
                required: true,
                layout: "colFormItem",
                regList: [],
                changeTag: true,
                document:
                  "https://element.eleme.cn/#/zh-CN/component/date-picker",
              },
              __vModel__: null,
              style: { width: "100%" },
              type: "daterange",
              "range-separator": this.$t("generator.to"),
              "start-placeholder": this.$t("generator.startDate"),
              "end-placeholder": this.$t("generator.endDate"),
              disabled: false,
              clearable: true,
              format: "yyyy-MM-dd",
              "value-format": "yyyy-MM-dd",

              readonly: false,
            },
            {
              __config__: {
                label: this.$t("generator.userDefinedSearch"),
                custom: true,
                checkedValue: null,
                labelWidth: null,
                showLabel: true,
                changeTag: true,
                tag: "el-input",
                tagIcon: "custom",
                defaultValue: null,
                required: true,
                layout: "colFormItem",
                span: 20,
                document: "https://element.eleme.cn/#/zh-CN/component/input",
                // 正则校验规则
                regList: [],
              },
              __vModel__: null,
              // 组件的插槽属性
              __slot__: {
                prepend: "",
                append: "",
              },

              // 其余的为可直接写在组件标签上的属性
              placeholder: this.$t("generator.selectTip"),
              style: { width: "100%" },
              clearable: true,
              "prefix-icon": "el-icon-search",
              "suffix-icon": "",
              maxlength: null,
              readonly: true,
              disabled: false,
              cFun: "",
            },
            {
              __config__: {
                label: this.$t("generator.Customcodetable"),
                custom: true,
                checkedValue: null,
                labelWidth: null,
                showLabel: true,
                changeTag: true,
                tag: "el-input",
                tagIcon: "Customcodetable",
                defaultValue: null,
                required: true,
                layout: "colFormItem",
                span: 20,
                document: "https://element.eleme.cn/#/zh-CN/component/input",
                // 正则校验规则
                regList: [],
              },
              __vModel__: null,
              // 组件的插槽属性
              __slot__: {
                prepend: "",
                append: "",
              },
              // 其余的为可直接写在组件标签上的属性
              placeholder: this.$t("generator.selectTip"),
              style: { width: "100%" },
              clearable: true,
              "prefix-icon": "el-icon-search",
              "suffix-icon": "",
              maxlength: null,
              readonly: true,
              disabled: false,
              singleChoice: false,
              codeName: "", //码表名称
              codeModel: "", //回显字段
              codeType: "3", //查询方式
              codeData: "", //请求参数
              codeTableId: "",
            },
            {
              __config__: {
                label: this.$t("generator.associatedProcess"),
                custom: true,
                checkedValue: null,
                labelWidth: null,
                showLabel: true,
                changeTag: true,
                tag: "el-input",
                tagIcon: "AssociatedProcess",
                defaultValue: null,
                required: true,
                layout: "colFormItem",
                span: 20,
                document: "https://element.eleme.cn/#/zh-CN/component/input",
                // 正则校验规则
                regList: [],
              },
              __vModel__: null,
              // 组件的插槽属性
              __slot__: {
                prepend: "",
                append: "",
              },
              // 其余的为可直接写在组件标签上的属性
              placeholder: this.$t("generator.selectTip"),
              style: { width: "100%" },
              clearable: true,
              "prefix-icon": "el-icon-search",
              "suffix-icon": "",
              maxlength: null,
              readonly: true,
              disabled: false,
              singleChoice: false,
              codeName: "", //码表名称
              codeModel: "", //回显字段
              codeType: "3", //查询方式
              codeData: "", //请求参数
              codeTableId: "",//
              processId:'',
            }           
          ],
        },
        {
          title: "home.LayoutComponents",
          list: [
            {
              __config__: {
                layout: "rowFormItem",
                tagIcon: "row",
                label: this.$t("generator.detailTable"),
                layoutTree: true,
                children: [],
                document: "https://element.eleme.cn/#/zh-CN/component/table",
              },
              type: "default",
              justify: "start",
              align: "top",
              tableType: "detailTable",
            },
          ],
        },
      ];
    },
    drawingDefalut: function () {
      return [
        {
          __config__: {
            label: this.$t("generator.SinglelineText"),
            labelWidth: null,
            showLabel: true,
            changeTag: true,
            tag: "el-input",
            tagIcon: "input",
            defaultValue: undefined,
            required: true,
            layout: "colFormItem",
            span: 24,
            showInput:true,
            document: "https://element.eleme.cn/#/zh-CN/component/input",
            // 正则校验规则
            regList: [
              {
                pattern: "/^1(3|4|5|7|8|9)\\d{9}$/",
                message: this.$t("generator.phonenumbererror"),
              },
            ],
          },
          // 组件的插槽属性
          __slot__: {
            prepend: "",
            append: "",
          },
          placeholder: this.$t("generator.phoneplaceholder"),
          style: { width: "100%" },
          clearable: true,
          "prefix-icon": "el-icon-mobile",
          "suffix-icon": "",
          maxlength: 11,
          "show-word-limit": true,
          readonly: false,
          disabled: false,
          isFormat: false,
        },
      ];
    },
  },
  created() {},
  data() {
    return {
      onlyDetail: [],
      rightPanel: true,
      logo,
      drawingList: [
        {
          __config__: {
            label: this.$t("generator.SinglelineText"),
            labelWidth: null,
            showLabel: true,
            changeTag: true,
            tag: "el-input",
            tagIcon: "input",
            defaultValue: undefined,
            required: true,
            layout: "colFormItem",
            span: 24,
            showInput:true,
            document: "https://element.eleme.cn/#/zh-CN/component/input",
            // 正则校验规则
            regList: [
              {
                pattern: "/^1(3|4|5|7|8|9)\\d{9}$/",
                message: this.$t("generator.phonenumbererror"),
              },
            ],
          },
          // 组件的插槽属性
          __slot__: {
            prepend: "",
            append: "",
          },
          placeholder: this.$t("generator.phoneplaceholder"),
          style: { width: "100%" },
          clearable: true,
          "prefix-icon": "el-icon-mobile",
          "suffix-icon": "",
          maxlength: 11,
          "show-word-limit": true,
          readonly: false,
          disabled: false,
          isFormat: false,
        },
      ],
      idGlobal,
      labelWidth: 120,
      dialogMode: false,
      drawingData: {},
      activeId: "",
      drawerVisible: false,
      formData: {},
      dialogVisible: false,
      jsonDrawerVisible: false,
      generateConf: null,
      showFileName: false,
      showTime: true,
      activeData: drawingDefalut[0],
      saveDrawingListDebounce: debounce(340, saveDrawingList),
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
      formConf: {
        formRef: "elForm",
        formModel: "formData",
        size: "medium",
        labelPosition: "right",
        labelWidth: 120,
        formRules: "rules",
        gutter: 15,
        disabled: false,
        span: 20,
        formBtns: true,
      },
    };
  },
  watch: {
    "activeData.__config__.label": function (val, oldVal) {
      if (
        this.activeData.placeholder === undefined ||
        !this.activeData.__config__.tag ||
        oldActiveId !== this.activeId
      ) {
        return;
      }
      this.activeData.placeholder = this.$t("home.enterTip") + val;
    },
    activeId: {
      handler(val) {
        oldActiveId = val;
      },
      immediate: true,
    },
    activeData: function () {
      if (
        this.activeData.__config__.tagIcon !== "row" &&
        this.activeData.parentCode
      ) {
        this.getDetailValue();
      }
    },
    drawingList: {
      handler(val) {
        this.saveDrawingListDebounce(val);
        if (val.length === 0) this.idGlobal = 100;
        this.drawingList.forEach((data) => {
          if (data.__config__.children) {
            data.__config__.children.forEach((res, index) => {
              if (res.__config__.tagIcon === "row") {
                data.__config__.children.splice(index, 1);
                this.$message.error(this.$t("home.rowTip"));
              }
            });
            data.tableType = "detailTable";
            data.__config__.children.forEach((de) => {
              de.tableType = "detailTable";
              de.parentCode = data.__vModel__;
              de.parentID = data.__config__.componentName;
            });
          } else {
            data.tableType = "subTable";
            delete data.parentCode;
          }
        });
      },
      deep: true,
    },
    idGlobal: {
      handler(val) {
        this.saveIdGlobalDebounce(val);
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.jsonData) {
      this.drawingList = this.jsonData;
    } else {
      this.drawingList = drawingDefalut;
    }
    this.activeFormItem(this.drawingList[0]);
    if (formConfInDB) {
      this.formConf = formConfInDB;
    }
    loadBeautifier((btf) => {
      beautifier = btf;
    });
    const clipboard = new ClipboardJS("#copyNode", {
      text: (trigger) => {
        const codeStr = this.generateCode();
        this.$notify({
          title: this.$t("home.success"),
          message: this.$t("home.copyTip"),
          type: "success",
        });
        return codeStr;
      },
    });
    clipboard.on("error", (e) => {
      this.$message.error(this.$t("home.copyfailure"));
    });
  },
  methods: {
    languages(e) {
      if (e == 1) {
        this.$set(this.$i18n, "locale", "zh");
      } else {
        this.$set(this.$i18n, "locale", "en");
      }
    },
    getDetailValue() {
      console.log('sssAS')
      var res = {};
      let url = this.baseUrl + this.activeData.parentCode;
      let _this = this;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          //请求成功
          if (xhr.status === 200) {
            //响应成功
            res = JSON.parse(xhr.response);
            if (res.code === "000000") {
              _this.onlyDetail = [];
              res.data.forEach((data) => {
                let regList = _this.judgeField(data);
                //取出所需要的值
                _this.onlyDetail.push({
                  label: data.fieldName,
                  value: data.fieldNameEn,
                  maxlength: data.fieldLength,
                  regList: regList,
                  fieldType: data.fieldType,
                });
              });
            } else {
              _this.$message.error(res.message);
            }
            // this.doResponse(xhr); //调用一个函数
          }
        }
      };
      xhr.open("get", url, true);
      xhr.setRequestHeader("X-Auth-Token", this.token); //设置请求头
      //1.请求方式  2.发送到哪去  3.是否为异步请求 是true 否 flase
      xhr.send(null);
    },
    judgeField(data) {
      //对数据库字段进行判断
      let regList = [];
      if (data.fieldType === "date") {
        regList.push({
          pattern:
            "/^[1-2]{1}([0-9]{3})-([0-1]{1})([0-9]{1})-(([0-2]){1}([0-9]{1})|([3]{1}[0-1]{1}))$/",
          message: this.$t("home.DateError"),
        });
      } else if (data.fieldType === "numeric") {
        regList.push({
          pattern: "/^[0-9]+(.[0-9]*)?$/",
          message: this.$t("home.numberTip"),
        });
      } else {
        regList.push({
          pattern: "/^.{0," + data.fieldLength + "}$/",
          message: this.$t("home.maxlength") + data.fieldLength,
        });
      }
      return regList;
    },
    activeFormItem(element) {
      // console.log(element)
      this.activeData = element;
      this.activeId = element.__config__.formId;
      this.rightPanel = false;// 切换组件的事实 更新右侧组件
            this.$nextTick(() => {
              this.rightPanel = true;
            });
    },
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData;
        this.activeId = this.idGlobal;
      }
    },
    addComponent(item) {
      const clone = this.cloneComponent(item);
      this.drawingList.push(clone);
      this.activeFormItem(clone);
    },
    cloneComponent(origin) {
      const clone = JSON.parse(JSON.stringify(origin));
      const config = clone.__config__;
      config.formId = ++this.idGlobal;
      config.span = this.formConf.span;
      config.renderKey = +new Date(); // 改变renderKey后可以实现强制更新组件
      if (config.layout === "colFormItem") {
        clone.tableType = "detailTable";
        clone.placeholder !== undefined && (clone.placeholder += config.label);
      } else if (config.layout === "rowFormItem") {
        config.componentName = `row${this.idGlobal}`;
        config.gutter = this.formConf.gutter;
        clone.tableType = "subTable";
      }
      tempActiveData = clone;

      return tempActiveData;
    },
    AssembleFormData() {
      this.formData = {
        fields: JSON.parse(JSON.stringify(this.drawingList)),
        ...this.formConf,
      };
    },
    changeField(data) {
      let detail = this.$refs.myRight.getDetail();
      let options = this.$refs.myRight.getOptions();
      let i = 0;
      this.drawingList.forEach((res) => {
        if (data === res.__vModel__) {
          i = i + 1;
          if (i > 1) {
            this.rightPanel = false;
            this.$message.error(this.$t("home.nametip"));
            this.$refs.myRight.clean();
            this.$nextTick(() => {
              this.rightPanel = true;
            });
          }
          options.forEach((de) => {
            if (res.__vModel__ === de.value) {
              if (
                (res.__config__.tagIcon === "custom" ||
                  res.__config__.tagIcon === "mechanism" ||
                  res.__config__.tagIcon === "user") &&
                (de.fieldType === "date" || de.fieldType === "numeric")
              ) {
                this.rightPanel = false;
                this.$message.error(
                  "date" +
                    this.$t("home.or") +
                    "numeric" +
                    this.$t("home.noSupportTip")
                );
                this.$refs.myRight.clean();
                this.$nextTick(() => {
                  this.rightPanel = true;
                });
              }
              res.__config__.regList = de.regList;
              res.maxlength = de.maxlength;
              res.fieldType = de.fieldType;
              let index = de.label.lastIndexOf("-");
              res.__config__.label = de.label.substring(
                index + 1,
                de.label.length
              );
            }
          });
        }
        if (res.__config__.tagIcon === "row") {
          res.__config__.children.forEach((child) => {
            if (data === child.__vModel__) {
              i = i + 1;
              if (i > 1) {
                this.rightPanel = false;
                this.$message.error(this.$t("home.nametip"));
                this.$refs.myRight.clean();
                this.$nextTick(() => {
                  this.rightPanel = true;
                });
              }
              detail.forEach((de) => {
                if (child.__vModel__ === de.value) {
                  if (
                    (child.__config__.tagIcon === "custom" ||
                      child.__config__.tagIcon === "mechanism" ||
                      child.__config__.tagIcon === "user") &&
                    (de.fieldType === "date" || de.fieldType === "numeric")
                  ) {
                    this.rightPanel = false;
                    this.$message.error(
                      "date" +
                        this.$t("home.or") +
                        "numeric" +
                        this.$t("home.noSupportTip")
                    );
                    this.$refs.myRight.clean();
                    this.$nextTick(() => {
                      this.rightPanel = true;
                    });
                  }
                  child.__config__.regList = de.regList;
                  child.maxlength = de.maxlength;
                  child.fieldType = de.fieldType;
                  let index = de.label.lastIndexOf("-");
                  res.__config__.label = de.label.substring(
                    index + 1,
                    de.label.length
                  );
                }
              });
            }
          });
        }
      });
      this.AssembleFormData();
    },
    generate(data) {
      const func = this[`exec${titleCase(this.operationType)}`];
      this.generateConf = data;
      func && func(data);
    },
    execRun(data) {
      this.AssembleFormData();
      this.drawerVisible = true;
    },
    execDownload(data) {
      const codeStr = this.generateCode();
      const blob = new Blob([codeStr], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, data.fileName);
    },
    execCopy(data) {
      document.getElementById("copyNode").click();
    },
    empty() {
      this.$confirm(this.$t("home.emptyTip"), this.$t("home.tips"), {
        type: "warning",
      }).then(() => {
        this.drawingList = this.drawingList.filter((item) => item.mandatory);
        this.idGlobal = 100;
      });
    },
    drawingItemCopy(item, parent) {
      let clone = JSON.parse(JSON.stringify(item));
      clone = this.createIdAndKey(clone);
      parent.push(clone);
      this.activeFormItem(clone);
    },
    createIdAndKey(item) {
      const config = item.__config__;
      config.formId = ++this.idGlobal;
      config.renderKey = +new Date();
      if (config.layout === "colFormItem") {
        // item.__vModel__ = `field${this.idGlobal}`;
      } else if (config.layout === "rowFormItem") {
        config.componentName = `row${this.idGlobal}`;
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map((childItem) =>
          this.createIdAndKey(childItem)
        );
      }
      return item;
    },
    drawingItemDelete(index, parent) {
      parent.splice(index, 1);
      this.$nextTick(() => {
        const len = this.drawingList.length;
        if (len) {
          this.activeFormItem(this.drawingList[len - 1]);
        }
      });
    },
    generateCode() {
      const { type } = this.generateConf;
      this.AssembleFormData();
      const script = vueScript(makeUpJs(this.formData, type));
      const html = vueTemplate(makeUpHtml(this.formData, type));
      const css = cssStyle(makeUpCss(this.formData));
      return beautifier.html(html + script + css, beautifierConf.html);
    },
    showJson() {
      this.AssembleFormData();
      this.jsonDrawerVisible = true;
    },
    download() {
      this.dialogVisible = true;
      this.showFileName = true;
      this.operationType = "download";
    },
    run() {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = "run";
    },
    copy() {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = "copy";
    },
    tagChange(newTag) {
      if (!newTag.__config__.formId) {
        newTag.__config__.formId = this.activeId;
      }
      this.activeData = newTag;
      this.showTime = false;
      this.drawingList.forEach((item, index) => {
        if (item.__config__.hasOwnProperty("children")) {
          let a = item.__config__.children.length;
          for (let i = 0; i < a; i++) {
            if (
              item.__config__.children[i].__config__.formId ===
              newTag.__config__.formId
            ) {
              item.__config__.children.splice(i, 1, newTag);
            }
          }
        } else {
          if (item.__config__.formId === newTag.__config__.formId) {
            this.drawingList.splice(index, 1, newTag);
          }
        }
      });

      this.$nextTick(() => {
        this.showTime = true;
      });
    },
    updateDrawingList(newTag, list) {
      const index = list.findIndex(
        (item) => item.__config__.formId === this.activeId
      );
      if (index > -1) {
        list.splice(index, 1, newTag);
      } else {
        list.forEach((item) => {
          if (Array.isArray(item.__config__.children))
            this.updateDrawingList(newTag, item.__config__.children);
        });
      }
    },
    refreshJson(data) {
      this.drawingList = JSON.parse(JSON.stringify(data.fields));
      delete data.fields;
      this.formConf = data;
    },

    getFormData() {
      this.formData = {
        fields: JSON.parse(JSON.stringify(this.drawingList)),
        ...this.formConf,
      };
      this.formData.fields.forEach((res) => {
        if (
          res.__config__.tagIcon === "custom" ||
          res.__config__.tagIcon === "mechanism" ||
          res.__config__.tagIcon === "user"
        ) {
          res.__config__.regList = [];
        } else if (res.__config__.tagIcon === "row") {
          res.__config__.children.forEach((child) => {
            if (
              child.__config__.tagIcon == "custom" ||
              child.__config__.tagIcon == "mechanism" ||
              child.__config__.tagIcon == "user"
            ) {
              child.__config__.regList = [];
            }
          });
        }
      });
      return this.formData;
    },
    getDetail() {
      return this.onlyDetail;
    },
  },
};
</script>

<style lang="scss" scope></style>
