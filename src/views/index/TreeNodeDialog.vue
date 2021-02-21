<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      :close-on-click-modal="false"
      :modal-append-to-body="true"
      :append-to-body="true"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
    >
      <el-row :gutter="0">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="small"
          label-width="100px"
        >
          <el-col :span="24">
            <el-form-item :label="$t('TreeNodeDialog.OptionName')" prop="label">
              <el-input
                v-model="formData.label"
                :placeholder="$t('TreeNodeDialog.Optionnameplaceholder')"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('TreeNodeDialog.Optionvalue')" prop="value">
              <el-input
                v-model="formData.value"
                :placeholder="$t('TreeNodeDialog.Optionvalueplaceholder')"
                clearable
              >
                <el-select
                  slot="append"
                  v-model="dataType"
                  :style="{ width: '100px' }"
                >
                  <el-option
                    v-for="(item, index) in dataTypeOptions"
                    :key="index"
                    :label="$t(item.label)"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="handelConfirm">
          {{$t('TreeNodeDialog.confirm')}}
        </el-button>
        <el-button @click="close">
           {{$t('TreeNodeDialog.cancel')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { isNumberStr } from "@/utils/index";
import { getTreeNodeId, saveTreeNodeId } from "@/utils/db";

const id = getTreeNodeId();

export default {
  components: {},
  inheritAttrs: false,
  props: [],
  data() {
    return {
      id,
      formData: {
        label: undefined,
        value: undefined
      },
      
      dataType: "string",
      dataTypeOptions: [
        {
          label: "TreeNodeDialog.characterString",
          value: "string"
        },
        {
          label: "TreeNodeDialog.number",
          value: "number"
        }
      ]
    };
  },
  computed: {
    rules(){
      return {
        label: [
          {
            required: true,
            message: this.$t('TreeNodeDialog.Optionnameplaceholder'),
            trigger: "blur"
          }
        ],
        value: [
          {
            required: true,
            message: this.$t('TreeNodeDialog.Optionvalueplaceholder'),
            trigger: "blur"
          }
        ]
      }
    },
  },
  watch: {
    "formData.value": function(val) {
      this.dataType = isNumberStr(val) ? "number" : "string";
    },
    id(val) {
      saveTreeNodeId(val);
    }
  },
  created() {},
  mounted() {},
  methods: {
    onOpen() {
      this.formData = {
        label: undefined,
        value: undefined
      };
    },
    onClose() {},
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return;
        if (this.dataType === "number") {
          this.formData.value = parseFloat(this.formData.value);
        }
        this.formData.id = this.id++;
        this.$emit("commit", this.formData);
        this.close();
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
