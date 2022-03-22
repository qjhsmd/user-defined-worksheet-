<template>
    <div class="right-board">
        <el-tabs v-model="currentTab" class="center-tabs">
            <el-tab-pane :label="$t('RightPanel.formProperties')" name="form" />
            <el-tab-pane :label="$t('RightPanel.ComponentProperties')" name="field" />
            <el-tab-pane :label="$t('RightPanel.componentEvents')" name="fieldFun" />
        </el-tabs>
        <div class="field-box">
            <el-scrollbar class="right-scrollbar">
                <!-- 组件属性 -->
                <el-form v-show="currentTab === 'field' && showField" size="small" label-width="90px">
                    <el-form-item v-if="activeData.tableType === 'subTable'" :label="$t('RightPanel.FieldName')"
                        required>
                        <el-select v-model="activeData.__vModel__" :placeholder="$t('RightPanel.selectTip')"
                            :style="{ width: '100%' }" @change="changeField"
                            :disabled="activeData.mandatory ? true : false">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.changeTag && !activeData.mandatory"
                        :label="$t('RightPanel.ComponentType')" required>
                        <el-select v-model="activeData.__config__.tagIcon" :placeholder="$t('RightPanel.typeSelectTip')"
                            :style="{ width: '100%' }" @change="tagChange" filterable>
                            <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
                                <el-option v-for="item in group.options" :key="item.__config__.label"
                                    :label="item.__config__.label" :value="item.__config__.tagIcon">
                                    <svg-icon class="node-icon" v-if="item.__config__.tagIcon == 'Customcodetable'" icon-class="custom" />
                                    <svg-icon class="node-icon" v-else :icon-class="item.__config__.tagIcon" />
                                    <span>{{ item.__config__.label }}</span>
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-collapse v-model="activeNames" v-if="activeData.__config__.tagIcon === 'Customcodetable' || activeData.__config__.tagIcon === 'AssociatedProcess'">
                        <el-collapse-item title="自定义查询" name="1">
                            <el-form-item :label="$t('RightPanel.processId')" v-if="activeData.__config__.tagIcon === 'AssociatedProcess'"
                                required>
                                <!-- @change="changeFieldcodeName"  :disabled="activeData.mandatory ? true : false"-->
                                <el-select v-model="activeData.processId" :placeholder="$t('RightPanel.ProcessPlaceholder')"
                                    :style="{ width: '100%' }" 
                                    >
                                    <el-option v-for="item in processOptions" :key="item.value" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('RightPanel.Codetable')"
                                required>
                                <el-select v-model="activeData.codeName" :placeholder="$t('RightPanel.Pleaseselect')"
                                    :style="{ width: '100%' }" @change="changeFieldcodeName"
                                    :disabled="activeData.mandatory ? true : false">
                                    <el-option v-for="item in codeNameOptions" :key="item.value" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('RightPanel.Echofields')"
                                required>
                                <el-select v-model="activeData.codeModel" :placeholder="$t('RightPanel.selectthe')"
                                    :style="{ width: '100%' }" @change="changeField"
                                    :disabled="activeData.mandatory ? true : false">
                                    <el-option v-for="item in codeModelArr" :key="item.value" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('RightPanel.Querymethod')"
                                required>
                                <el-radio-group v-model="activeData.codeType">
                                    <el-radio :label="'3'">{{$t('RightPanel.Popup')}}</el-radio>
                                    <el-radio :label="'6'">{{$t('RightPanel.Inputbox')}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item v-if="activeData.__config__.tagIcon === 'Customcodetable' && activeData.codeType=='6'" :label="$t('RightPanel.Requestparameters')"
                                required>
                                <el-select v-model="activeData.codeData" :placeholder="$t('RightPanel.selectrequest')"
                                    :style="{ width: '100%' }" @change="changeField"
                                    :disabled="activeData.mandatory ? true : false">
                                    <el-option v-for="item in codeDataArr" :key="item.value" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-collapse-item>
                    </el-collapse>
                    <el-collapse class="collapse-box" v-model="activeNames" v-if="activeData.__config__.tagIcon !== 'row' &&activeData.__config__.tagIcon !== 'custom' && activeData.__config__.tagIcon !== 'Customcodetable' && activeData.__config__.tagIcon !== 'AssociatedProcess'">
                        <el-collapse-item :title="$t('RightPanel.Associateservice')" name="1">
                            <!-- 普通栏位是否关联自定义码表 -->
                            <el-form-item  :label="$t('RightPanel.Isitrelated')" required>
                                <el-switch v-model="activeData.isCodeName" @change="changeIsCodeName" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                            </el-form-item>
                            <el-form-item v-if="activeData.__config__.tagIcon !== 'Customcodetable' && activeData.__config__.tagIcon !== 'AssociatedProcess' && activeData.isCodeName " :label="$t('RightPanel.Associated')"
                                required>
                                <el-select v-model="activeData.normalCodeName" :placeholder="$t('RightPanel.selectrequest')"
                                    :style="{ width: '100%' }" @change="changeNormalCodeName"
                                    :disabled="activeData.mandatory ? true : false">
                                    <el-option v-for="item in normalCodeNameOptions" :key="item.value" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="activeData.__config__.tagIcon !== 'Customcodetable' && activeData.__config__.tagIcon !== 'AssociatedProcess' && activeData.isCodeName && activeData.normalCodeName !== ''" :label="$t('RightPanel.Echofields')"
                                required>
                                <el-select v-model="activeData.normalCodeModel" :placeholder="$t('RightPanel.selectthe')"
                                    :style="{ width: '100%' }" @change="changeField"
                                    :disabled="activeData.mandatory ? true : false">
                                    <el-option v-for="item in normalCodeModelOptions" :key="item.value" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-collapse-item>
                    </el-collapse>
                    <el-form-item v-if="
              activeData.tableType === 'detailTable' &&
                activeData.__config__.tagIcon === 'row'
            " :label="$t('RightPanel.TableName')">
                        <el-select v-model="activeData.__vModel__" :placeholder="$t('RightPanel.selectTip')"
                            :style="{ width: '100%' }" @change="changeField">
                            <el-option v-for="item in detailFields" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="
              activeData.tableType === 'detailTable' &&
                activeData.__config__.tagIcon !== 'row'
            " :label="$t('RightPanel.FieldName')">
                        <el-select v-model="activeData.__vModel__" :placeholder="$t('RightPanel.selectTip')"
                            :style="{ width: '100%' }" @change="changeField" filterable>
                            <el-option v-for="item in onlyDetail" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item
            v-if="activeData.__config__.componentName !== undefined"
            label="组件名"
            >{{ activeData.__config__.componentName }}</el-form-item
          > -->
                    <el-form-item v-if="activeData.__config__.label !== undefined" :label="$t('RightPanel.title')"
                        required>
                        <el-input v-model="activeData.__config__.label" :placeholder="$t('RightPanel.titletip')" />
                    </el-form-item>
                    <el-form-item v-if="activeData.placeholder !== undefined"
                        :label="$t('RightPanel.SpaceOccupyingPrompt')" required>
                        <el-input v-model="activeData.placeholder" :placeholder="$t('RightPanel.SpaceTip')" />
                    </el-form-item>
                    <el-form-item v-if="activeData['start-placeholder'] !== undefined"
                        :label="$t('RightPanel.startOccupy')">
                        <el-input v-model="activeData['start-placeholder']" :placeholder="$t('RightPanel.SpaceTip')" />
                    </el-form-item>
                    <el-form-item v-if="activeData['end-placeholder'] !== undefined"
                        :label="$t('RightPanel.endOccupy')">
                        <el-input v-model="activeData['end-placeholder']" :placeholder="$t('RightPanel.SpaceTip')" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.span !== undefined" :label="$t('RightPanel.FormGrid')">
                        <el-slider v-model="activeData.__config__.span" :max="24" :min="1" :marks="{ 12: '' }"
                            @change="spanChange" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.layout === 'rowFormItem'"
                        :label="$t('RightPanel.GridSpacing')">
                        <el-input-number v-model="activeData.gutter" :min="1"
                            :placeholder="$t('RightPanel.GridSpacing')" />
                    </el-form-item>
                    <!-- <el-form-item
            v-if="activeData.__config__.layout === 'rowFormItem'"
            label="布局模式"
          >
            <el-radio-group v-model="activeData.type">
              <el-radio-button label="default" />
              <el-radio-button label="flex" />
            </el-radio-group>
          </el-form-item> -->
                    <el-form-item v-if="
              activeData.justify !== undefined && activeData.type === 'flex'
            " :label="$t('RightPanel.HorizontalArrangement')">
                        <el-select v-model="activeData.justify" :placeholder="$t('RightPanel.Arrangementtip')"
                            :style="{ width: '100%' }">
                            <el-option v-for="(item, index) in justifyOptions" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="activeData.align !== undefined && activeData.type === 'flex'"
                        :label="$t('RightPanel.VerticalArrangement')">
                        <el-radio-group v-model="activeData.align">
                            <el-radio-button label="top" />
                            <el-radio-button label="middle" />
                            <el-radio-button label="bottom" />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.labelWidth !== undefined"
                        :label="$t('RightPanel.LabelWidth')">
                        <el-input v-model.number="activeData.__config__.labelWidth" type="number"
                            :placeholder="$t('RightPanel.LabelWidthTip')" />
                    </el-form-item>
                    <!-- <el-form-item
            v-if="activeData.style && activeData.style.width !== undefined"
            label="组件宽度"
          >
            <el-input
              v-model="activeData.style.width"
              placeholder="请输入组件宽度"
              clearable
            />
          </el-form-item> -->
                    <el-form-item v-if="
              activeData.__vModel__ !== undefined &&
                activeData.__config__.tagIcon !== 'custom' &&
                activeData.__config__.tagIcon !== 'mechanism' &&
                activeData.__config__.tagIcon !== 'user'
            " :label="$t('RightPanel.DefaultValue')">
                        <el-input :value="setDefaultValue(activeData.__config__.defaultValue)"
                            :placeholder="$t('RightPanel.DefaultTip')" @input="onDefaultValueInput" />
                    </el-form-item>
                    <el-form-item v-if="
            activeData.tableType === 'subTable' &&
            activeData.__vModel__ !== undefined &&
              activeData.__config__.tagIcon == 'input'
            " :label="$t('RightPanel.VarDefaultValue')">
                        <el-select v-model="activeData.variableCOn" clearable :placeholder="$t('RightPanel.VarDefaultValueTip')"
                            :style="{ width: '100%' }">
                            <el-option v-for="(item, index) in optionsChoise" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="
              activeData.__config__.tagIcon == 'user'
            " :label="$t('RightPanel.VarDefaultValue')">
                        <el-select v-model="activeData.variableCOn" :placeholder="$t('RightPanel.VarDefaultValueTip')"
                            :style="{ width: '100%' }">
                            <el-option v-for="(item, index) in userOptions" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="
              activeData.__config__.tagIcon == 'mechanism'
            " :label="$t('RightPanel.VarDefaultValue')">
                        <el-select v-model="activeData.variableCOn" :placeholder="$t('RightPanel.VarDefaultValueTip')"
                            :style="{ width: '100%' }">
                            <el-option v-for="(item, index) in deptOptions" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <!-- activeData.__vModel__ !== undefined && -->

                    <el-form-item v-if="
                activeData.__config__.tagIcon == 'date'
            " :label="$t('RightPanel.VarDefaultValue')">
                        <el-select v-model="activeData.variableDate" clearable :placeholder="$t('RightPanel.VarDefaultValueTip')"
                            :style="{ width: '100%' }" @change="variableDateChange">
                            <el-option v-for="(item, index) in dataOptions" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <!-- 正则表达式 -->
                    <el-form-item v-if="
            (activeData.tableType === 'subTable' || activeData.tableType === 'detailTable') &&
            activeData.__vModel__ !== undefined &&
            (activeData.__config__.tagIcon == 'input' || activeData.__config__.tagIcon == 'textarea')
            " :label="$t('RightPanel.VerificationRules')">
                        <el-select v-model="regList" clearable @clear="clearReg" :placeholder="$t('RightPanel.VerificationRulestip')"
                            :style="{ width: '100%' }" @change="addReg">
                            <el-option v-for="(item, index) in regularChoise" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="
            (activeData.tableType === 'subTable' || activeData.tableType === 'detailTable') &&
            activeData.__vModel__ !== undefined &&
            (activeData.__config__.tagIcon == 'input' || activeData.__config__.tagIcon == 'textarea')
            " :label="$t('RightPanel.regularExpression')">
                        <el-input :readonly="regLabel === $t('RightPanel.UserDefinedRules') ? false:true"
                            @input="customReg" v-model="customList" />
                    </el-form-item>
                    <el-form-item v-if="
            (activeData.tableType === 'subTable' || activeData.tableType === 'detailTable') &&
            activeData.__vModel__ !== undefined &&
            (activeData.__config__.tagIcon == 'input' || activeData.__config__.tagIcon == 'textarea')
            " :label="$t('RightPanel.VerificationTips')">
                        <el-input :readonly="regLabel === $t('RightPanel.UserDefinedRules')? false:true"
                            @input="customRegMsg" v-model="customMsg" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-checkbox-group'"
                        :label="$t('RightPanel.AtLeast')">
                        <el-input-number :value="activeData.min" :min="0" :placeholder="$t('RightPanel.AtLeast')"
                            @input="$set(activeData, 'min', $event ? $event : undefined)" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tag === 'el-checkbox-group'"
                        :label="$t('RightPanel.AtMost')">
                        <el-input-number :value="activeData.max" :min="0" :placeholder="$t('RightPanel.AtMost')"
                            @input="$set(activeData, 'max', $event ? $event : undefined)" />
                    </el-form-item>
                    <!-- <el-form-item
            v-if="
              activeData.__slot__ && activeData.__slot__.prepend !== undefined
            "
            label="前缀"
          >
            <el-input
              v-model="activeData.__slot__.prepend"
              placeholder="请输入前缀"
            />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="
              activeData.__slot__ && activeData.__slot__.append !== undefined
            "
            label="后缀"
          >
            <el-input
              v-model="activeData.__slot__.append"
              placeholder="请输入后缀"
            />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData['prefix-icon'] !== undefined"
            label="前图标"
          >
            <el-input
              v-model="activeData['prefix-icon']"
              placeholder="请输入前图标名称"
            >
              <el-button
                slot="append"
                icon="el-icon-thumb"
                @click="openIconsDialog('prefix-icon')"
                >选择</el-button
              >
            </el-input>
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData['suffix-icon'] !== undefined"
            label="后图标"
          >
            <el-input
              v-model="activeData['suffix-icon']"
              placeholder="请输入后图标名称"
            >
              <el-button
                slot="append"
                icon="el-icon-thumb"
                @click="openIconsDialog('suffix-icon')"
                >选择</el-button
              >
            </el-input>
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="
              activeData['icon'] !== undefined &&
                activeData.__config__.tag === 'el-button'
            "
            label="按钮图标"
          >
            <el-input
              v-model="activeData['icon']"
              placeholder="请输入按钮图标名称"
            >
              <el-button
                slot="append"
                icon="el-icon-thumb"
                @click="openIconsDialog('icon')"
                >选择</el-button
              >
            </el-input>
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.__config__.tag === 'el-button'"
            label="按钮文字"
          >
            <el-input
              v-model="activeData.__slot__.default"
              placeholder="请输入按钮文字"
            />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.__config__.tag === 'el-button'"
            label="调用接口"
          >
            <el-select
              v-model="activeData.cFun"
              placeholder="请选择"
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="item in clickName"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
                    <el-form-item v-if="activeData.__config__.tagIcon === 'custom'" :label="$t('RightPanel.type')"
                        required>
                        <el-select v-model="activeData.cFun" :placeholder="$t('RightPanel.selectTips')"
                            :style="{ width: '100%' }" filterable>
                            <el-option v-for="item in clickName" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tagIcon === 'code'" :label="$t('RightPanel.type')"
                        required>
                        <el-select v-model="activeData.codeTableId" :placeholder="$t('RightPanel.selectTips')"
                            :style="{ width: '100%' }" filterable>
                            <el-option v-for="item in codeList" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="activeData.__config__.tagIcon === 'mechanism'" :label="$t('RightPanel.type')">
                        <el-input v-model="mechanism" :style="{ width: '100%' }" readonly></el-input>
                    </el-form-item>

                    <el-form-item v-if="activeData.__config__.tagIcon === 'user'" :label="$t('RightPanel.type')">
                        <el-input v-model="user" :style="{ width: '100%' }" readonly></el-input>
                    </el-form-item>
                    <el-form-item v-if="
              activeData.__config__.tagIcon === 'custom' ||
                activeData.__config__.tagIcon === 'user' ||
                activeData.__config__.tagIcon === 'Customcodetable'
            " :label="$t('RightPanel.whetherMultiple')">

                        <el-switch v-model="activeData.singleChoice" />
                    </el-form-item>
                    <!-- <el-form-item
            v-if="activeData.__config__.tag === 'el-cascader'"
            label="选项分隔符"
          >
            <el-input
              v-model="activeData.separator"
              placeholder="请输入选项分隔符"
            />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.autosize !== undefined"
            label="最小行数"
          >
            <el-input-number
              v-model="activeData.autosize.minRows"
              :min="1"
              placeholder="最小行数"
            />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.autosize !== undefined"
            label="最大行数"
          >
            <el-input-number
              v-model="activeData.autosize.maxRows"
              :min="1"
              placeholder="最大行数"
            />
          </el-form-item> -->
                    <!-- <el-form-item v-if="isShowMin" label="最小值">
            <el-input-number v-model="activeData.min" placeholder="最小值" />
          </el-form-item>
          <el-form-item v-if="isShowMax" label="最大值">
            <el-input-number v-model="activeData.max" placeholder="最大值" />
          </el-form-item> -->
                    <!-- <el-form-item v-if="activeData.height !== undefined" label="组件高度">
            <el-input-number
              v-model="activeData.height"
              placeholder="高度"
              @input="changeRenderKey"
            />
          </el-form-item> -->
                    <!-- <el-form-item v-if="isShowStep" label="步长">
            <el-input-number v-model="activeData.step" placeholder="步数" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.__config__.tag === 'el-input-number'"
            label="精度"
          >
            <el-input-number
              v-model="activeData.precision"
              :min="0"
              placeholder="精度"
            />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.__config__.tag === 'el-input-number'"
            label="按钮位置"
          >
            <el-radio-group v-model="activeData['controls-position']">
              <el-radio-button label>默认</el-radio-button>
              <el-radio-button label="right">右侧</el-radio-button>
            </el-radio-group>
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="
              activeData.maxlength !== undefined &&
                !activeData.__config__.custom
            "
            label="最多输入"
          >
            <el-input
              v-model="activeData.maxlength"
              placeholder="请输入字符长度"
            >
              <template slot="append">个字符</template>
            </el-input>
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData['active-text'] !== undefined"
            label="开启提示"
          >
            <el-input
              v-model="activeData['active-text']"
              placeholder="请输入开启提示"
            />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData['inactive-text'] !== undefined"
            label="关闭提示"
          >
            <el-input
              v-model="activeData['inactive-text']"
              placeholder="请输入关闭提示"
            />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData['active-value'] !== undefined"
            label="开启值"
          >
            <el-input
              :value="setDefaultValue(activeData['active-value'])"
              placeholder="请输入开启值"
              @input="onSwitchValueInput($event, 'active-value')"
            />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData['inactive-value'] !== undefined"
            label="关闭值"
          >
            <el-input
              :value="setDefaultValue(activeData['inactive-value'])"
              placeholder="请输入关闭值"
              @input="onSwitchValueInput($event, 'inactive-value')"
            />
          </el-form-item> -->
                    <el-form-item v-if="
              activeData.type !== undefined &&
                'el-date-picker' === activeData.__config__.tag
            " :label="$t('RightPanel.TimeType')">
                        <el-select v-model="activeData.type" :placeholder="$t('RightPanel.TimeTypeTips')"
                            :style="{ width: '100%' }" @change="dateTypeChange">
                            <el-option v-for="(item, index) in dateOptions" :key="index" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="activeData.name !== undefined" :label="$t('RightPanel.fieldName')">
                        <el-input v-model="activeData.name" :placeholder="$t('RightPanel.fieldNamePlaceholder')" />
                    </el-form-item>
                    <el-form-item v-if="activeData.accept !== undefined" :label="$t('RightPanel.fileType')">
                        <el-select v-model="activeData.accept" :placeholder="$t('RightPanel.fileTypePlaceholder')"
                            :style="{ width: '100%' }" clearable>
                            <el-option :label="$t('RightPanel.img')" value="image/*" />
                            <el-option :label="$t('RightPanel.video')" value="video/*" />
                            <el-option :label="$t('RightPanel.audio')" value="audio/*" />
                            <el-option label="excel" value=".xls,.xlsx" />
                            <el-option label="word" value=".doc,.docx" />
                            <el-option label="pdf" value=".pdf" />
                            <el-option label="txt" value=".txt" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.fileSize !== undefined"
                        :label="$t('RightPanel.fileSize')">
                        <el-input v-model.number="activeData.__config__.fileSize"
                            :placeholder="$t('RightPanel.fileSizePlaceholder')">
                            <el-select slot="append" v-model="activeData.__config__.sizeUnit"
                                :style="{ width: '66px' }">
                                <el-option label="KB" value="KB" />
                                <el-option label="MB" value="MB" />
                                <el-option label="GB" value="GB" />
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="activeData.action !== undefined" :label="$t('RightPanel.UploadAddress')">
                        <el-input v-model="activeData.action" :placeholder="$t('RightPanel.UploadAddressPlaceholder')"
                            clearable />
                    </el-form-item>
                    <el-form-item v-if="activeData['list-type'] !== undefined" :label="$t('RightPanel.ListType')">
                        <el-radio-group v-model="activeData['list-type']" size="small">
                            <el-radio-button label="text">text</el-radio-button>
                            <el-radio-button label="picture">picture</el-radio-button>
                            <el-radio-button label="picture-card">picture-card</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="
              activeData.type !== undefined &&
                activeData.__config__.tag === 'el-button'
            " :label="$t('RightPanel.ButtonType')">
                        <el-select v-model="activeData.type" :style="{ width: '100%' }">
                            <el-option label="primary" value="primary" />
                            <el-option label="success" value="success" />
                            <el-option label="warning" value="warning" />
                            <el-option label="danger" value="danger" />
                            <el-option label="info" value="info" />
                            <el-option label="text" value="text" />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.buttonText !== undefined"
                        v-show="'picture-card' !== activeData['list-type']" :label="$t('RightPanel.ButtonText')">
                        <el-input v-model="activeData.__config__.buttonText"
                            :placeholder="$t('RightPanel.ButtonTextPlaceholder')" />
                    </el-form-item>
                    <!-- <el-form-item
            v-if="activeData['range-separator'] !== undefined"
            label="分隔符"
          >
            <el-input
              v-model="activeData['range-separator']"
              placeholder="请输入分隔符"
            />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData['picker-options'] !== undefined"
            label="时间段"
          >
            <el-input
              v-model="activeData['picker-options'].selectableRange"
              placeholder="请输入时间段"
            />
          </el-form-item> -->
                    <!-- <el-form-item v-if="activeData.format !== undefined" label="时间格式">
            <el-input
              :value="activeData.format"
              placeholder="请输入时间格式"
              @input="setTimeValue($event)"
            />
          </el-form-item> -->
                    <template v-if="
              ['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(
                activeData.__config__.tag
              ) > -1
            ">
            <el-form-item
                         :label="$t('RightPanel.dataType')">
                        <el-select  v-model="activeData.__config__.selectArrType" @change="selectArrTypeChange">
                            <el-option v-for="item in optionTypeArr" :key="item.optionType" :label="item.des"
                                        :value="item.optionType"></el-option>
                        </el-select>
                    </el-form-item>
                        <el-divider>{{$t('RightPanel.option')}}</el-divider>
                        <!-- <draggable :list="activeData.__slot__.options" :animation="340" group="selectItem"
                            handle=".option-drag"> -->
                            <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
                                <div class="select-line-icon option-drag">
                                    <i class="el-icon-s-operation" />
                                </div>
                                <el-input v-model="item.label" :placeholder="$t('RightPanel.OptionName')"
                                    size="small" />
                                <el-input :placeholder="$t('RightPanel.OptionValue')" size="small" :value="item.value"
                                    @input="setOptionValue(item, $event)" />
                                <!-- <div class="close-btn select-line-icon"
                                    @click="activeData.__slot__.options.splice(index, 1)">
                                    <i class="el-icon-remove-outline" />
                                </div> -->
                            </div>
                        <!-- </draggable> -->
                        <!-- <div style="margin-left: 20px;">
                            <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
                                @click="addSelectItem">{{$t('RightPanel.AddOptions')}}</el-button>
                        </div> -->
                        <el-divider />
                    </template>

                    <template v-if="['el-cascader'].indexOf(activeData.__config__.tag) > -1">
                        <el-divider>{{$t('RightPanel.option')}}</el-divider>
                        <el-form-item :label="$t('RightPanel.dataType')">
                            <el-radio-group v-model="activeData.__config__.dataType" size="small">
                                <el-radio-button label="dynamic">{{$t('RightPanel.dynamicData')}}</el-radio-button>
                                <el-radio-button label="static">{{$t('RightPanel.StaticData')}}</el-radio-button>
                            </el-radio-group>
                        </el-form-item>

                        <template v-if="activeData.__config__.dataType === 'dynamic'">
                            <el-form-item :label="$t('RightPanel.TagKeyName')">
                                <el-input v-model="activeData.props.props.label"
                                    :placeholder="$t('RightPanel.TagKeyNamePlaceholder')" />
                            </el-form-item>
                            <el-form-item :label="$t('RightPanel.ValueKeyName')">
                                <el-input v-model="activeData.props.props.value"
                                    :placeholder="$t('RightPanel.ValueKeyNamePlaceholder')" />
                            </el-form-item>
                            <el-form-item :label="$t('RightPanel.ChildKeyName')">
                                <el-input v-model="activeData.props.props.children"
                                    :placeholder="$t('RightPanel.ChildKeyNamePlaceholder')" />
                            </el-form-item>
                        </template>

                        <!-- 级联选择静态树 -->
                        <el-tree v-if="activeData.__config__.dataType === 'static'" draggable :data="activeData.options"
                            node-key="id" :expand-on-click-node="false" :render-content="renderContent" />
                        <div v-if="activeData.__config__.dataType === 'static'" style="margin-left: 20px">
                            <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text"
                                @click="addTreeItem">{{$t('RightPanel.AddParent')}}</el-button>
                        </div>
                        <el-divider />
                    </template>

                    <el-form-item v-if="activeData.__config__.optionType !== undefined"
                        :label="$t('RightPanel.OptionStyle')">
                        <el-radio-group v-model="activeData.__config__.optionType">
                            <el-radio-button label="default">{{$t('RightPanel.default')}}</el-radio-button>
                            <el-radio-button label="button">{{$t('RightPanel.button')}}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="activeData['active-color'] !== undefined" :label="$t('RightPanel.openColor')">
                        <el-color-picker v-model="activeData['active-color']" />
                    </el-form-item>
                    <el-form-item v-if="activeData['inactive-color'] !== undefined"
                        :label="$t('RightPanel.closeColor')">
                        <el-color-picker v-model="activeData['inactive-color']" />
                    </el-form-item>

                    <!-- <el-form-item
            v-if="
              activeData.__config__.showLabel !== undefined &&
                activeData.__config__.labelWidth !== undefined
            "
            label="显示标签"
          >
            <el-switch v-model="activeData.__config__.showLabel" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.branding !== undefined"
            label="品牌烙印"
          >
            <el-switch v-model="activeData.branding" @input="changeRenderKey" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData['allow-half'] !== undefined"
            label="允许半选"
          >
            <el-switch v-model="activeData['allow-half']" />
          </el-form-item> -->
                    <el-form-item v-if="activeData['show-text'] !== undefined" :label="$t('RightPanel.AuxiliaryText')">
                        <el-switch v-model="activeData['show-text']" @change="rateTextChange" />
                    </el-form-item>
                    <el-form-item v-if="activeData['show-score'] !== undefined" :label="$t('RightPanel.ShowFraction')">
                        <el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
                    </el-form-item>
                    <el-form-item v-if="activeData['show-stops'] !== undefined"
                        :label="$t('RightPanel.ShowBreakpoints')">
                        <el-switch v-model="activeData['show-stops']" />
                    </el-form-item>
                    <!-- <el-form-item v-if="activeData.range !== undefined" label="范围选择">
            <el-switch v-model="activeData.range" @change="rangeChange" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="
              activeData.__config__.border !== undefined &&
                activeData.__config__.optionType === 'default'
            "
            label="是否带边框"
          >
            <el-switch v-model="activeData.__config__.border" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.__config__.tag === 'el-color-picker'"
            label="颜色格式"
          >
            <el-select
              v-model="activeData['color-format']"
              placeholder="请选择颜色格式"
              :style="{ width: '100%' }"
              clearable
              @change="colorFormatChange"
            >
              <el-option
                v-for="(item, index) in colorFormatOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="
              activeData.size !== undefined &&
                (activeData.__config__.optionType === 'button' ||
                  activeData.__config__.border ||
                  activeData.__config__.tag === 'el-color-picker' ||
                  activeData.__config__.tag === 'el-button')
            "
            label="组件尺寸"
          >
            <el-radio-group v-model="activeData.size">
              <el-radio-button label="medium">中等</el-radio-button>
              <el-radio-button label="small">较小</el-radio-button>
              <el-radio-button label="mini">迷你</el-radio-button>
            </el-radio-group>
          </el-form-item> -->
                    <el-form-item v-if="activeData['show-word-limit'] !== undefined"
                        :label="$t('RightPanel.InputStatistics')">
                        <el-switch v-model="activeData['show-word-limit']" />
                    </el-form-item>
                    <!-- <el-form-item
            v-if="activeData.__config__.tag === 'el-input-number'"
            label="严格步数"
          >
            <el-switch v-model="activeData['step-strictly']" />
          </el-form-item> -->
                    <!-- <el-form-item v-if="activeData.__config__.tag === 'el-cascader'"
                        :label="$t('RightPanel.whetherMultiple')">
                        <el-switch v-model="activeData.props.props.multiple" />
                    </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.__config__.tag === 'el-cascader'"
            label="展示全路径"
          >
            <el-switch v-model="activeData['show-all-levels']" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.__config__.tag === 'el-cascader'"
            label="可否筛选"
          >
            <el-switch v-model="activeData.filterable" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.clearable !== undefined"
            label="能否清空"
          >
            <el-switch v-model="activeData.clearable" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.__config__.showTip !== undefined"
            label="显示提示"
          >
            <el-switch v-model="activeData.__config__.showTip" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.__config__.tag === 'el-upload'"
            label="多选文件"
          >
            <el-switch v-model="activeData.multiple" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData['auto-upload'] !== undefined"
            label="自动上传"
          >
            <el-switch v-model="activeData['auto-upload']" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.readonly !== undefined"
            label="是否只读"
          >
            <el-switch v-model="activeData.readonly" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.disabled !== undefined"
            label="是否禁用"
          >
            <el-switch v-model="activeData.disabled" />
          </el-form-item> -->
                    <!-- <el-form-item
            v-if="activeData.__config__.tag === 'el-select'"
            label="能否搜索"
          >
            <el-switch v-model="activeData.filterable" />
          </el-form-item> -->
                    <!-- <el-form-item v-if="activeData.__config__.tag === 'el-select'"
                        :label="$t('RightPanel.whetherMultiple')">
                        <el-switch v-model="activeData.multiple" @change="multipleChange" />
                    </el-form-item> -->
                    <el-form-item v-if="activeData.__config__.required !== undefined && !activeData.mandatory" 
                        :label="$t('RightPanel.whetherRequired')">
                        <el-switch v-model="activeData.__config__.required" />
                    </el-form-item>
                    <el-form-item v-if="activeData.__config__.tagIcon === 'Customcodetable' && activeData.codeType === '6'" 
                        :label="$t('RightPanel.whetherHidden')">
                        <el-switch v-model="activeData.__config__.hidden" />
                    </el-form-item>

                    <template v-if="activeData.__config__.layoutTree">
                        <el-divider>{{$t('RightPanel.LayoutStructureTree')}}</el-divider>
                        <el-tree :data="[activeData.__config__]" :props="layoutTreeProps" node-key="renderKey"
                            default-expand-all draggable>
                            <span slot-scope="{ node, data }">
                                <span class="node-label">
                                    <svg-icon class="node-icon" :icon-class="
                      data.__config__ ? data.__config__.tagIcon : data.tagIcon
                    " />
                                    {{ node.label }}
                                </span>
                            </span>
                        </el-tree>
                    </template>
                    <!-- 新增隐藏域属性 qjh -->
                    <el-form-item v-if="
              activeData.__config__.showInput !== undefined" :label="$t('RightPanel.whetherShowInput')">
                        <el-switch v-model="activeData.__config__.showInput" />
                    </el-form-item>
                    <!-- add amountFormat switch by maikangzhi -->
                    <el-form-item v-if="
              activeData.isFormat !== undefined &&activeData.__config__.regList.length>0 && '/(^[1-9]([0-9]+)?(.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9].[0-9]([0-9])?$)/' === activeData.__config__.regList[0]['pattern']" :label="$t('RightPanel.isFormat')">
                        <el-switch v-model="activeData.isFormat" />
                    </el-form-item>
                   
                    <el-form-item v-if="
              activeData.__config__.tagIcon === 'input' || activeData.__config__.tagIcon === 'textarea' || activeData.__config__.tagIcon === 'date' "  :label="$t('RightPanel.isReadonly')">
                        <el-switch v-model="activeData.readonly" />
                    </el-form-item>
                    <el-form-item v-if=" activeData.__config__.tagIcon === 'select' "  :label="$t('RightPanel.isReadonly')">
                        <el-switch v-model="activeData.disabled" />
                    </el-form-item>
                    <el-form-item :label="$t('RightPanel.rangeDate')" v-if="activeData.type==='date'">
                        <el-input v-model="activeData.rangeDate" @input="inputDate($event)"
                            :placeholder="$t('RightPanel.templateDate')" />
                    </el-form-item>
                    <el-form-item :label="$t('RightPanel.selectTime')" v-if="activeData['picker-options']">
                        <el-input v-model="activeData['picker-options'].selectableRange" @input="inputTime($event)"
                            :placeholder="$t('RightPanel.selectTimePh')" />
                    </el-form-item>

                    <!-- <template v-if="activeData.__config__.layout === 'colFormItem'">
            <el-divider>正则校验</el-divider>
            <div
              v-for="(item, index) in activeData.__config__.regList"
              :key="index"
              class="reg-item"
            >
              <span
                class="close-btn"
                @click="activeData.__config__.regList.splice(index, 1)"
              >
                <i class="el-icon-close" />
              </span>
              <el-form-item label="表达式">
                <el-input v-model="item.pattern" placeholder="请输入正则" />
              </el-form-item>
              <el-form-item label="错误提示" style="margin-bottom:0">
                <el-input v-model="item.message" placeholder="请输入错误提示" />
              </el-form-item>
            </div>
            <div style="margin-left: 20px">
              <el-button
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addReg"
                >添加规则</el-button
              >
            </div>
          </template> -->
                    
                    
                </el-form>
                <!-- 表单属性 -->
                <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
                    <!-- <el-form-item label="表单名">
                        <el-input
                        v-model="formConf.formRef"
                        placeholder="请输入表单名（ref）"
                        />
                    </el-form-item> -->
                                <!-- <el-form-item label="表单模型">
                        <el-input
                        v-model="formConf.formModel"
                        placeholder="请输入数据模型"
                        />
                    </el-form-item> -->
                                <!-- <el-form-item label="校验模型">
                        <el-input
                        v-model="formConf.formRules"
                        placeholder="请输入校验模型"
                        />
                    </el-form-item> -->
                    <el-form-item :label="$t('RightPanel.FormSize')">
                        <el-radio-group v-model="formConf.size">
                            <el-radio-button label="medium">{{$t('RightPanel.medium')}}</el-radio-button>
                            <el-radio-button label="small">{{$t('RightPanel.smaller')}}</el-radio-button>
                            <el-radio-button label="mini">{{$t('RightPanel.Mini')}}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('RightPanel.LabelAlignment')">
                        <el-radio-group v-model="formConf.labelPosition">
                            <el-radio-button label="left">{{$t('RightPanel.AlignLeft')}}</el-radio-button>
                            <el-radio-button label="right">{{$t('RightPanel.AlignRight')}}</el-radio-button>
                            <el-radio-button label="top">{{$t('RightPanel.AlignTop')}}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('RightPanel.LabelWidth')">
                        <el-input v-model.number="formConf.labelWidth" type="number"
                            :placeholder="$t('RightPanel.LabelWidthTip')" />
                    </el-form-item>
                    <!-- <el-form-item label="栅格间隔">
                        <el-input-number
                        v-model="formConf.gutter"
                        :min="0"
                        placeholder="栅格间隔"
                        />
                    </el-form-item> -->
                                <!-- <el-form-item label="禁用表单">
                        <el-switch v-model="formConf.disabled" />
                    </el-form-item>
                    <el-form-item label="表单按钮">
                        <el-switch v-model="formConf.formBtns" />
                    </el-form-item>
                    <el-form-item label="显示未选中组件边框">
                        <el-switch v-model="formConf.unFocusedComponentBorder" />
                    </el-form-item> -->
                </el-form>
                <!-- 组件事件 -->
                <el-form v-show="currentTab === 'fieldFun'" size="small" label-width="120px">
                    <el-form-item :label="$t('RightPanel.eventType')" required>
                        <el-select v-model="activeData.event" :placeholder="$t('RightPanel.selectTip')"
                            :style="{ width: '100%' }" @change="changeFieldFun">
                            <el-option v-for="item in funoptions" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 设置计算属性 -->
                    <el-form-item required>
                        <span slot="label">
                            <span class="span-box">
                                <span>{{$t('RightPanel.eventResponse')}}</span>
                                <i class="el-icon-warning-outline ico-pre" @click="exampleShow"></i>
                                <!-- <el-tooltip class="item" effect="light" placement="bottom">
                                    <div slot="content">
                                        <div class="">数值相加：Number(value['a']) + Number(value['b']) = c</div>
                                        <div class="">字符串拼接：value['a'] + value['b'] = c</div>
                                    </div> -->
                                <!-- </el-tooltip> -->
                            </span>
                        </span>
                        <el-input @change="changeInputFun" type="textarea" :rows="8" placeholder="value['a'] + value['b'] = c" v-model="activeData.showfun">
                        </el-input>
                    </el-form-item>
                    <!-- 设置计算属性 -->
                    <el-form-item required>
                        <span slot="label">
                            <span class="span-box">
                                <span>{{$t('RightPanel.mobileEventResponse')}}</span>
                                <i class="el-icon-warning-outline ico-pre" @click="exampleShow"></i>
                                <!-- <el-tooltip class="item" effect="light" placement="bottom">
                                    <div slot="content">
                                        <div class="">数值相加：Number(value['a']) + Number(value['b']) = c</div>
                                        <div class="">字符串拼接：value['a'] + value['b'] = c</div>
                                    </div> -->
                                <!-- </el-tooltip> -->
                            </span>
                        </span>
                        <el-input @change="changeInputMfun" type="textarea" :rows="8" placeholder="value['a'] + value['b'] = c" v-model="activeData.mfun">
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="
              activeData.tableType === 'detailTable' &&
                activeData.__config__.tagIcon !== 'row'
            " :label="$t('RightPanel.FieldName')">
                        <el-select v-model="onlyShow" :placeholder="$t('RightPanel.selectTip')"
                            :style="{ width: '100%' }" @change="checkFieldModel" filterable>
                            <el-option v-for="item in onlyDetail" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-else :label="$t('RightPanel.fieldQuery')">
                        <el-select v-model="onlyShow" :placeholder="$t('RightPanel.selectTip')"
                            :style="{ width: '100%' }"  @change="checkFieldModel"
                            :disabled="activeData.mandatory ? true : false">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('RightPanel.fieldShow')">
                        <div>{{onlyShow}}</div>
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </div>
        <el-dialog :append-to-body="true" class="example-box" title="示例（其中a、b、c、m为栏位绑定的v-model）" :visible.sync="dialogVisibleExample" width="50%">
            <el-form size="small" label-width="100px">
                <el-form-item label="主表字段相加">
                    <div>
                        that.formConfCopy.fields.forEach(el => { <br>
                        if (el.__vModel__ === 'c') {<br>
                            that.$set(el.__config__, 'defaultValue', Number(value['a']) + Number(value['b'])); <br>
                            that.formData['c'] = Number(value['a']) + Number(value['b'])<br>
                        }})
                    </div>
                </el-form-item>
                <el-form-item label="明细字段相加">
                    <div>
                        that.formConfCopy.fields.forEach(el => {<br>
                            if(el.__config__.hasOwnProperty('children')) {<br>
                            el.__config__.children.forEach(item => {<br>
                            if (item.__vModel__ === 'c') {<br>
                                that.$set(item.__config__, 'defaultValue', Number(value['a']) + Number(value['b']));<br>
                                that.formData['c'] = Number(value['a']) + Number(value['b']);<br>
                            }})}});
                    </div>
                </el-form-item>
                <el-form-item label="移动字段相加">
                    <div>
                        that.jsonData.forEach(el => { <br>
                            if (el.__vModel__ === 'c') {<br>
                            that.$set(el.__config__,'defaultValue',value['a']+value['c']);<br> 
                            el.__config__ = Object.assign({}, el.__config__)<br>
                         }})
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
        <treeNode-dialog :visible.sync="dialogVisible" :title="$t('RightPanel.AddOptions')" @commit="addNode" />
        <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
    </div>
</template>

<script>
import "../../icons";
import { isArray, log } from "util";
import draggable from "vuedraggable";
import TreeNodeDialog from "@/views/index/TreeNodeDialog";
import { isNumberStr } from "@/utils/index";
import IconsDialog from "./IconsDialog";
// import {
//   inputComponents,
//   selectComponents,
//   layoutComponents
// } from "@/components/generator/config";
import { saveFormConf } from "@/utils/db";
import Vue from "vue";
import axios from "axios";
Vue.prototype.$axios = axios;

const dateTimeFormat = {
    date: "yyyy-MM-dd",
    week: "yyyy 第 WW 周",
    month: "yyyy-MM",
    year: "yyyy",
    datetime: "yyyy-MM-dd HH:mm:ss",
    daterange: "yyyy-MM-dd",
    monthrange: "yyyy-MM",
    datetimerange: "yyyy-MM-dd HH:mm:ss"
};

export default {
    components: {
        TreeNodeDialog,
        IconsDialog,
        draggable
    },
    props: [
        "showField",
        "activeData",
        "options",
        "formConf",
        "clickName",
        "codeList",
        "detailFields",
        "onlyDetail",
        "codeNameOptions",
        "processOptions",
        "optionTypeArr",
        "optionDataArr",
        "codeModelOptions",
        "codeDataOptions",
        "formData",
        "drawingList"
    ],
    data() {
        return {
            dialogVisibleExample: false,
            showfun: '',
            onlyShow: '',
            funoptions: [
                {
                    label: 'onClick',
                    value: 'click'
                },
                {
                    label: 'onInput',
                    value: 'input'
                },{
                    label: 'onChange',
                    value: 'change'
                }
            ],
            calcNames: ['1'],
            activeNames: ['1'],
            allObj: {},
            codeDataArr: [],
            codeModelArr: [],
            normalCodeModelOptions: [],
            normalCodeNameOptions: [],
            customMsg: '',
            customList: '',
            regLabel: '',
            regList: '',
            value: "",
            currentTab: "field",
            currentNode: null,
            dialogVisible: false,
            iconsVisible: false,
            currentIconModel: null,


            colorFormatOptions: [
                {
                    label: "hex",
                    value: "hex"
                },
                {
                    label: "rgb",
                    value: "rgb"
                },
                {
                    label: "rgba",
                    value: "rgba"
                },
                {
                    label: "hsv",
                    value: "hsv"
                },
                {
                    label: "hsl",
                    value: "hsl"
                }
            ],
            justifyOptions: [
                {
                    label: "start",
                    value: "start"
                },
                {
                    label: "end",
                    value: "end"
                },
                {
                    label: "center",
                    value: "center"
                },
                {
                    label: "space-around",
                    value: "space-around"
                },
                {
                    label: "space-between",
                    value: "space-between"
                }
            ],
            layoutTreeProps: {
                label(data, node) {
                    const config = data.__config__;
                    return data.componentName || `${config.label}: ${data.__vModel__}`;
                }
            },
        };
    },
    computed: {
        dateRangeTypeOptions() {
            return [
                {
                    label: this.$t('RightPanel.daterange'),
                    value: "daterange"
                },
                {
                    label: this.$t('RightPanel.monthrange'),
                    value: "monthrange"
                },
                {
                    label: this.$t('RightPanel.datetimerange'),
                    value: "datetimerange"
                }
            ]
        },
        dateTypeOptions() {
            return [
                {
                    label: this.$t('RightPanel.date'),
                    value: "date"
                },
                {
                    label: this.$t('RightPanel.week'),
                    value: "week"
                },
                {
                    label: this.$t('RightPanel.month'),
                    value: "month"
                },
                {
                    label: this.$t('RightPanel.year'),
                    value: "year"
                },
                {
                    label: this.$t('RightPanel.datetime'),
                    value: "datetime"
                }
            ]
        },
        dateTypeOptions() {
            return [
                {
                    label: this.$t('RightPanel.date'),
                    value: "date"
                },
                {
                    label: this.$t('RightPanel.week'),
                    value: "week"
                },
                {
                    label: this.$t('RightPanel.month'),
                    value: "month"
                },
                {
                    label: this.$t('RightPanel.year'),
                    value: "year"
                },
                {
                    label: this.$t('RightPanel.datetime'),
                    value: "datetime"
                }
            ]
        },
        dataOptions() {
            return [{
                value: "default_apply_date",
                label: this.$t('RightPanel.currentDate')
            }]
        },
        userOptions() {
            return [{
                value: "default_apply_user2",
                label: this.$t('RightPanel.applier')
            }]
        },
        deptOptions() {
            return [{
                value: "default_apply_dept2",
                label: this.$t('RightPanel.ApplicationDepartment')
            }]
        },

        optionsChoise() {
            return [{
                value: "default_apply_user",
                label: this.$t('RightPanel.applier')
            },
            {
                value: "default_apply_dept",
                label: this.$t('RightPanel.ApplicationDepartment')
            },
            {
                value: "default_apply_user_id",
                label: this.$t('RightPanel.ApplicationUserId')
            },
            {
                value: "default_apply_dept_id",
                label: this.$t('RightPanel.ApplicationDepID')
            }]
        },
        regularChoise() {
            return [{
                value: "/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/",
                label: this.$t('RightPanel.AmountVerification'),
                message: this.$t('RightPanel.AmountVerificationMsg')
            }, {
                value: "/^-?[1-9]\d*$/",
                label: this.$t('RightPanel.IntegerVerification'),
                message: this.$t('RightPanel.IntegerVerificationMsg')
            }, {
                value: "/^[0-9]*$ /",
                label: this.$t('RightPanel.DigitalVerification'),
                message: this.$t('RightPanel.DigitalVerificationMsg')
            }, {
                value: "/((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))$/",
                label: this.$t('RightPanel.DateFormatVerification'),
                message: this.$t('RightPanel.DateFormatVerificationMsg')
            }, {
                value: this.$t('RightPanel.inputTip'),
                label: this.$t('RightPanel.UserDefinedRules'),
                message: ''
            }]
        },
        mechanism() {
            return this.$t('RightPanel.organizationSearch')
        },
        user() {
            return this.$t('RightPanel.userSearch')
        },
        selectComponents() {
            return [
                {
                    __config__: {
                        label: this.$t('generator.DropDownSelection'),
                        showLabel: true,
                        labelWidth: null,
                        tag: 'el-select',
                        tagIcon: 'select',
                        defaultValue: undefined,
                        layout: 'colFormItem',
                        span: 20,
                        required: true,
                        regList: [],
                        changeTag: true,
                        selectArrType:'',
                        document: 'https://element.eleme.cn/#/zh-CN/component/select'
                    },
                    __vModel__: null,
                    __slot__: {
                        options: [{
                            label: this.$t('generator.Option') + '1',
                            value: 1
                        }, {
                            label: this.$t('generator.Option') + '2',
                            value: 2
                        }]
                    },
                    placeholder: this.$t('generator.selectTip'),
                    style: { width: '100%' },
                    clearable: true,
                    disabled: false,
                    filterable: false,
                    multiple: false
                },
                {
                    __config__: {
                        label: this.$t('generator.CascadeSelection'),
                        showLabel: true,
                        labelWidth: null,
                        tag: 'el-cascader',
                        tagIcon: 'cascader',
                        layout: 'colFormItem',
                        defaultValue: [],
                        dataType: 'dynamic',
                        span: 20,
                        required: true,
                        regList: [],
                        changeTag: true,
                        document: 'https://element.eleme.cn/#/zh-CN/component/cascader'
                    },
                    __vModel__: null,
                    options: [{
                        id: 1,
                        value: 1,
                        label: this.$t('generator.Option') + '1',
                        children: [{
                            id: 2,
                            value: 2,
                            label: this.$t('generator.Option') + '1-1'
                        }]
                    }],
                    placeholder: this.$t('generator.selectTip'),
                    style: { width: '100%' },
                    props: {
                        props: {
                            multiple: false,
                            label: 'label',
                            value: 'value',
                            children: 'children'
                        }
                    },
                    'show-all-levels': true,
                    disabled: false,
                    clearable: true,
                    filterable: false,
                    separator: '/'
                },
                {
                    __config__: {
                        label: this.$t('generator.RadioBoxGroup'),
                        labelWidth: null,
                        showLabel: true,
                        tag: 'el-radio-group',
                        tagIcon: 'radio',
                        changeTag: true,
                        defaultValue: undefined,
                        layout: 'colFormItem',
                        span: 20,
                        optionType: 'default',
                        regList: [],
                        required: true,
                        border: false,
                        selectArrType:'',
                        document: 'https://element.eleme.cn/#/zh-CN/component/radio'
                    },

                    __slot__: {
                        options: [{
                            label: this.$t('generator.Option') + '1',
                            value: 1
                        }, {
                            label: this.$t('generator.Option') + '2',
                            value: 2
                        }]
                    },
                    style: {},
                    size: 'medium',
                    disabled: false,
                    __vModel__: null,
                },
                {
                    __config__: {
                        label: this.$t('generator.MultiBoxGroup'),
                        tag: 'el-checkbox-group',
                        tagIcon: 'checkbox',
                        defaultValue: [],
                        span: 20,
                        showLabel: true,
                        labelWidth: null,
                        layout: 'colFormItem',
                        optionType: 'default',
                        required: true,
                        regList: [],
                        changeTag: true,
                        border: false,
                        selectArrType:'',
                        document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
                    },
                    __vModel__: null,
                    __slot__: {
                        options: [{
                            label: this.$t('generator.Option') + '1',
                            value: 1
                        }, {
                            label: this.$t('generator.Option') + '2',
                            value: 2
                        },
                        {
                            label: this.$t('generator.Option') + '3',
                            value: 3
                        }]
                    },
                    style: {},
                    size: 'medium',
                    min: null,
                    max: null,
                    disabled: false,

                },
                {
                    __config__: {
                        label: this.$t('generator.switch'),
                        tag: 'el-switch',
                        tagIcon: 'switch',
                        defaultValue: false,
                        span: 20,
                        showLabel: true,
                        labelWidth: null,
                        layout: 'colFormItem',
                        required: true,
                        regList: [],
                        changeTag: true,
                        document: 'https://element.eleme.cn/#/zh-CN/component/switch'
                    },
                    __vModel__: null,
                    style: {},
                    disabled: false,
                    'active-text': '',
                    'inactive-text': '',
                    'active-color': null,
                    'inactive-color': null,
                    'active-value': true,
                    'inactive-value': false
                },
                {
                    __config__: {
                        label: this.$t('generator.timePicker'),
                        tag: 'el-time-picker',
                        tagIcon: 'time',
                        defaultValue: null,
                        span: 20,
                        showLabel: true,
                        layout: 'colFormItem',
                        labelWidth: null,
                        required: true,
                        regList: [],
                        changeTag: true,
                        document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
                    },
                    __vModel__: null,
                    placeholder: this.$t('generator.selectTip'),
                    style: { width: '100%' },
                    disabled: false,
                    clearable: true,
                    'picker-options': {
                        selectableRange: '00:00:00-23:59:59'
                    },
                    format: 'HH:mm',
                    'value-format': 'HH:mm'
                },
                {
                    __config__: {
                        label: this.$t('generator.timeRanges'),
                        tag: 'el-time-picker',
                        tagIcon: 'time-range',
                        span: 20,
                        showLabel: true,
                        labelWidth: null,
                        layout: 'colFormItem',
                        defaultValue: null,
                        required: true,
                        regList: [],
                        changeTag: true,
                        document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
                    },
                    __vModel__: null,
                    style: { width: '100%' },

                    disabled: false,
                    clearable: true,
                    'is-range': true,
                    'range-separator': this.$t('generator.to'),
                    'start-placeholder': this.$t('generator.startTime'),
                    'end-placeholder': this.$t('generator.endTime'),
                    format: 'HH:mm',
                    'value-format': 'HH:mm'
                },

                {
                    __config__: {
                        label: this.$t('generator.DatePicker'),
                        tag: 'el-date-picker',
                        tagIcon: 'date',
                        defaultValue: null,
                        showLabel: true,
                        labelWidth: null,
                        span: 20,
                        layout: 'colFormItem',
                        required: true,
                        regList: [],
                        changeTag: true,
                        document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
                    },
                    __vModel__: null,
                    placeholder: this.$t('generator.selectTip'),
                    type: 'date',
                    style: { width: '100%' },
                    disabled: false,
                    clearable: true,
                    format: 'yyyy-MM-dd',
                    'value-format': 'yyyy-MM-dd',
                    readonly: false
                },
                {
                    __config__: {
                        label: this.$t('generator.dateRange'),
                        tag: 'el-date-picker',
                        tagIcon: 'date-range',
                        defaultValue: null,
                        span: 20,
                        showLabel: true,
                        labelWidth: null,
                        required: true,
                        layout: 'colFormItem',
                        regList: [],
                        changeTag: true,
                        document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
                    },
                    __vModel__: null,
                    style: { width: '100%' },
                    type: 'daterange',
                    'range-separator': this.$t('generator.to'),
                    'start-placeholder': this.$t('generator.startDate'),
                    'end-placeholder': this.$t('generator.endDate'),
                    disabled: false,
                    clearable: true,
                    format: 'yyyy-MM-dd',
                    'value-format': 'yyyy-MM-dd',

                    readonly: false
                },
                {
                    __config__: {
                        label: this.$t('generator.userDefinedSearch'),
                        custom: true,
                        checkedValue: null,
                        labelWidth: null,
                        showLabel: true,
                        changeTag: true,
                        tag: 'el-input',
                        tagIcon: 'custom',
                        defaultValue: null,
                        required: true,
                        layout: 'colFormItem',
                        span: 20,
                        document: 'https://element.eleme.cn/#/zh-CN/component/input',
                        // 正则校验规则
                        regList: []
                    },
                    __vModel__: null,
                    // 组件的插槽属性
                    __slot__: {
                        prepend: '',
                        append: ''
                    },

                    // 其余的为可直接写在组件标签上的属性
                    placeholder: this.$t('generator.selectTip'),
                    style: { width: '100%' },
                    clearable: true,
                    'prefix-icon': 'el-icon-search',
                    'suffix-icon': '',
                    maxlength: null,
                    readonly: true,
                    disabled: false,
                    cFun: ''
                },
                {
                    __config__: {
                        label: this.$t('generator.organizationSearch'),
                        custom: true,
                        checkedValue: null,
                        labelWidth: null,
                        showLabel: true,
                        changeTag: true,
                        tag: 'el-input',
                        tagIcon: 'mechanism',
                        defaultValue: null,
                        required: true,
                        layout: 'colFormItem',
                        span: 20,
                        document: 'https://element.eleme.cn/#/zh-CN/component/input',
                        // 正则校验规则
                        regList: []
                    },
                    __vModel__: null,
                    // 组件的插槽属性
                    __slot__: {
                        prepend: '',
                        append: ''
                    },
                    // 其余的为可直接写在组件标签上的属性
                    placeholder: this.$t('generator.selectTip'),
                    style: { width: '100%' },
                    clearable: true,
                    'prefix-icon': 'el-icon-search',
                    'suffix-icon': '',
                    maxlength: null,
                    readonly: true,
                    disabled: false,
                    cFun: 'ORG_ID'
                },
                {
                    __config__: {
                        label: this.$t('generator.userSearch'),
                        custom: true,
                        checkedValue: null,
                        labelWidth: null,
                        showLabel: true,
                        changeTag: true,
                        tag: 'el-input',
                        tagIcon: 'user',
                        defaultValue: null,
                        required: true,
                        layout: 'colFormItem',
                        span: 20,
                        document: 'https://element.eleme.cn/#/zh-CN/component/input',
                        // 正则校验规则
                        regList: []
                    },
                    __vModel__: null,
                    // 组件的插槽属性
                    __slot__: {
                        prepend: '',
                        append: ''
                    },
                    // 其余的为可直接写在组件标签上的属性
                    placeholder: this.$t('generator.selectTip'),
                    style: { width: '100%' },
                    clearable: true,
                    'prefix-icon': 'el-icon-search',
                    'suffix-icon': '',
                    maxlength: null,
                    readonly: true,
                    disabled: false,
                    singleChoice: false,
                    cFun: 'USER_ID'
                },
                {
                    __config__: {
                        label: this.$t('generator.CodeTableQuery'),
                        custom: true,
                        checkedValue: null,
                        labelWidth: null,
                        showLabel: true,
                        changeTag: true,
                        tag: 'el-input',
                        tagIcon: 'code',
                        defaultValue: null,
                        required: true,
                        layout: 'colFormItem',
                        span: 20,
                        document: 'https://element.eleme.cn/#/zh-CN/component/input',
                        // 正则校验规则
                        regList: []
                    },
                    __vModel__: null,
                    // 组件的插槽属性
                    __slot__: {
                        prepend: '',
                        append: ''
                    },
                    // 其余的为可直接写在组件标签上的属性
                    placeholder: this.$t('generator.selectTip'),
                    style: { width: '100%' },
                    clearable: true,
                    'prefix-icon': 'el-icon-search',
                    'suffix-icon': '',
                    maxlength: null,
                    readonly: true,
                    disabled: false,
                    singleChoice: false,
                    codeTableId: ''
                },
                {
                            __config__: {
                                label: this.$t('generator.associatedProcess'),
                                custom: true,
                                checkedValue: null,
                                labelWidth: null,
                                showLabel: true,
                                changeTag: true,
                                tag: 'el-input',
                                tagIcon: 'AssociatedProcess',
                                defaultValue: null,
                                required: true,
                                layout: 'colFormItem',
                                span: 20,
                                document: 'https://element.eleme.cn/#/zh-CN/component/input',
                                // 正则校验规则
                                regList: []
                            },
                            __vModel__: null,
                            // 组件的插槽属性
                            __slot__: {
                                prepend: '',
                                append: ''
                            },
                            // 其余的为可直接写在组件标签上的属性
                            placeholder: this.$t('generator.selectTip'),
                            style: { width: '100%' },
                            clearable: true,
                            'prefix-icon': 'el-icon-search',
                            'suffix-icon': '',
                            maxlength: null,
                            readonly: true,
                            disabled: false,
                            singleChoice: false,
                            codeName: '',//码表名称
                            codeModel: '',//回显字段
                            codeType: '3',//查询方式
                            codeData: '',//请求参数
                            codeTableId: ''
                        }

            ]
        },
        inputComponents() {
            return [
                {
                    // 组件的自定义配置
                    __config__: {
                        label: this.$t('generator.SinglelineText'),
                        labelWidth: null,
                        showLabel: true,
                        changeTag: true,
                        tag: 'el-input',
                        tagIcon: 'input',
                        defaultValue: undefined,
                        required: true,
                        layout: 'colFormItem',
                        span: 20,
                        showInput:true,
                        document: 'https://element.eleme.cn/#/zh-CN/component/input',
                        // 正则校验规则
                        regList: []
                    },
                    // 组件的插槽属性
                    __slot__: {
                        prepend: '',
                        append: ''
                    },
                    __vModel__: null,
                    // 其余的为可直接写在组件标签上的属性
                    placeholder: this.$t('generator.enterTip'),
                    style: { width: '100%' },
                    clearable: true,
                    'prefix-icon': '',
                    'suffix-icon': '',
                    maxlength: null,
                    'show-word-limit': false,
                    readonly: false,
                    disabled: false,
                    isFormat: false,
                },
                {
                    __config__: {
                        label: this.$t('generator.MultilineText'),
                        labelWidth: null,
                        showLabel: true,
                        tag: 'el-input',
                        tagIcon: 'textarea',
                        defaultValue: undefined,
                        required: true,
                        layout: 'colFormItem',
                        span: 20,
                        regList: [],
                        changeTag: true,
                        document: 'https://element.eleme.cn/#/zh-CN/component/input'
                    },
                    __vModel__: null,
                    type: 'textarea',
                    placeholder: this.$t('generator.enterTip'),
                    autosize: {
                        minRows: 4,
                        maxRows: 4
                    },
                    style: { width: '100%' },
                    maxlength: null,
                    'show-word-limit': false,
                    readonly: false,
                    disabled: false
                },
                {
                    __config__: {
                        label: this.$t('generator.Customcodetable'),
                        custom: true,
                        checkedValue: null,
                        labelWidth: null,
                        showLabel: true,
                        changeTag: true,
                        hidden: false,
                        tag: 'el-input',
                        tagIcon: 'Customcodetable',
                        defaultValue: null,
                        required: true,
                        layout: 'colFormItem',
                        span: 20,
                        document: 'https://element.eleme.cn/#/zh-CN/component/input',
                        // 正则校验规则
                        regList: []
                    },
                    __vModel__: null,
                    // 组件的插槽属性
                    __slot__: {
                        prepend: '',
                        append: ''
                    },
                    // 其余的为可直接写在组件标签上的属性
                    placeholder: this.$t('generator.selectTip'),
                    style: { width: '100%' },
                    clearable: true,
                    'prefix-icon': 'el-icon-search',
                    'suffix-icon': '',
                    maxlength: null,
                    readonly: true,
                    disabled: false,
                    singleChoice: false,
                    codeName: '',//码表名称
                    codeModel: '',//回显字段
                    codeType: '3',//查询方式
                    codeData: '',//请求参数
                    codeTableId: '',             
                },
            ]
        },
        dateOptions() {
            if (
                this.activeData.type !== undefined &&
                this.activeData.__config__.tag === "el-date-picker"
            ) {
                if (this.activeData["start-placeholder"] === undefined) {
                    return this.dateTypeOptions;
                }
                return this.dateRangeTypeOptions;
            }
            return [];
        },
        tagList() {
            return [
                {
                    label: this.$t('RightPanel.InputTypeComponents'),
                    options: [
                        {
                            // 组件的自定义配置
                            __config__: {
                                label: this.$t('generator.SinglelineText'),
                                labelWidth: null,
                                showLabel: true,
                                changeTag: true,
                                tag: 'el-input',
                                tagIcon: 'input',
                                defaultValue: undefined,
                                required: true,
                                layout: 'colFormItem',
                                span: 20,
                                document: 'https://element.eleme.cn/#/zh-CN/component/input',
                                // 正则校验规则
                                regList: []
                            },
                            // 组件的插槽属性
                            __slot__: {
                                prepend: '',
                                append: ''
                            },
                            __vModel__: null,
                            // 其余的为可直接写在组件标签上的属性
                            placeholder: this.$t('generator.enterTip'),
                            style: { width: '100%' },
                            clearable: true,
                            'prefix-icon': '',
                            'suffix-icon': '',
                            maxlength: null,
                            'show-word-limit': false,
                            readonly: false,
                            disabled: false
                        },
                        {
                            __config__: {
                                label: this.$t('generator.MultilineText'),
                                labelWidth: null,
                                showLabel: true,
                                tag: 'el-input',
                                tagIcon: 'textarea',
                                defaultValue: undefined,
                                required: true,
                                layout: 'colFormItem',
                                span: 20,
                                regList: [],
                                changeTag: true,
                                document: 'https://element.eleme.cn/#/zh-CN/component/input'
                            },
                            __vModel__: null,
                            type: 'textarea',
                            placeholder: this.$t('generator.enterTip'),
                            autosize: {
                                minRows: 4,
                                maxRows: 4
                            },
                            style: { width: '100%' },
                            maxlength: null,
                            'show-word-limit': false,
                            readonly: false,
                            disabled: false
                        },
                    ],
                },
                {
                    label: this.$t('RightPanel.OptionalComponents'),
                    options: [
                        {
                            __config__: {
                                label: this.$t('generator.DropDownSelection'),
                                showLabel: true,
                                labelWidth: null,
                                tag: 'el-select',
                                tagIcon: 'select',
                                defaultValue: undefined,
                                layout: 'colFormItem',
                                span: 20,
                                required: true,
                                regList: [],
                                changeTag: true,
                                selectArrType:'',
                                document: 'https://element.eleme.cn/#/zh-CN/component/select'
                            },
                            __vModel__: null,
                            __slot__: {
                                options: [{
                                    label: this.$t('generator.Option') + '1',
                                    value: 1
                                }, {
                                    label: this.$t('generator.Option') + '2',
                                    value: 2
                                }]
                            },
                            placeholder: this.$t('generator.selectTip'),
                            style: { width: '100%' },
                            clearable: true,
                            disabled: false,
                            filterable: false,
                            multiple: false
                        },
                        {
                            __config__: {
                                label: this.$t('generator.CascadeSelection'),
                                showLabel: true,
                                labelWidth: null,
                                tag: 'el-cascader',
                                tagIcon: 'cascader',
                                layout: 'colFormItem',
                                defaultValue: [],
                                dataType: 'dynamic',
                                span: 20,
                                required: true,
                                regList: [],
                                changeTag: true,
                                document: 'https://element.eleme.cn/#/zh-CN/component/cascader'
                            },
                            __vModel__: null,
                            options: [{
                                id: 1,
                                value: 1,
                                label: this.$t('generator.Option') + '1',
                                children: [{
                                    id: 2,
                                    value: 2,
                                    label: this.$t('generator.Option') + '1-1'
                                }]
                            }],
                            placeholder: this.$t('generator.selectTip'),
                            style: { width: '100%' },
                            props: {
                                props: {
                                    multiple: false,
                                    label: 'label',
                                    value: 'value',
                                    children: 'children'
                                }
                            },
                            'show-all-levels': true,
                            disabled: false,
                            clearable: true,
                            filterable: false,
                            separator: '/'
                        },
                        {
                            __config__: {
                                label: this.$t('generator.RadioBoxGroup'),
                                labelWidth: null,
                                showLabel: true,
                                tag: 'el-radio-group',
                                tagIcon: 'radio',
                                changeTag: true,
                                defaultValue: undefined,
                                layout: 'colFormItem',
                                span: 20,
                                optionType: 'default',
                                regList: [],
                                required: true,
                                border: false,
                                selectArrType:'',
                                document: 'https://element.eleme.cn/#/zh-CN/component/radio'
                            },

                            __slot__: {
                                options: [{
                                    label: this.$t('generator.Option') + '1',
                                    value: 1
                                }, {
                                    label: this.$t('generator.Option') + '2',
                                    value: 2
                                }]
                            },
                            style: {},
                            size: 'medium',
                            disabled: false,
                            __vModel__: null,
                        },
                        {
                            __config__: {
                                label: this.$t('generator.MultiBoxGroup'),
                                tag: 'el-checkbox-group',
                                tagIcon: 'checkbox',
                                defaultValue: [],
                                span: 20,
                                showLabel: true,
                                labelWidth: null,
                                layout: 'colFormItem',
                                optionType: 'default',
                                required: true,
                                regList: [],
                                changeTag: true,
                                border: false,
                                selectArrType:'',
                                document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
                            },
                            __vModel__: null,
                            __slot__: {
                                options: [{
                                    label: this.$t('generator.Option') + '1',
                                    value: 1
                                }, {
                                    label: this.$t('generator.Option') + '2',
                                    value: 2
                                },
                                {
                                    label: this.$t('generator.Option') + '3',
                                    value: 3
                                }]
                            },
                            style: {},
                            size: 'medium',
                            min: null,
                            max: null,
                            disabled: false,

                        },
                        {
                            __config__: {
                                label: this.$t('generator.switch'),
                                tag: 'el-switch',
                                tagIcon: 'switch',
                                defaultValue: false,
                                span: 20,
                                showLabel: true,
                                labelWidth: null,
                                layout: 'colFormItem',
                                required: true,
                                regList: [],
                                changeTag: true,
                                document: 'https://element.eleme.cn/#/zh-CN/component/switch'
                            },
                            __vModel__: null,
                            style: {},
                            disabled: false,
                            'active-text': '',
                            'inactive-text': '',
                            'active-color': null,
                            'inactive-color': null,
                            'active-value': true,
                            'inactive-value': false
                        },
                        // {
                        //   __config__: {
                        //     label: '滑块',
                        //     tag: 'el-slider',
                        //     tagIcon: 'slider',
                        //     defaultValue: null,
                        //     span: 20,
                        //     showLabel: true,
                        //     layout: 'colFormItem',
                        //     labelWidth: null,
                        //     required: true,
                        //     regList: [],
                        //     changeTag: true,
                        //     document: 'https://element.eleme.cn/#/zh-CN/component/slider'
                        //   },
                        //   __vModel__: null,
                        //   disabled: false,
                        //   min: 0,
                        //   max: 100,
                        //   step: 1,
                        //   'show-stops': false,
                        //   range: false
                        // },
                        {
                            __config__: {
                                label: this.$t('generator.timePicker'),
                                tag: 'el-time-picker',
                                tagIcon: 'time',
                                defaultValue: null,
                                span: 20,
                                showLabel: true,
                                layout: 'colFormItem',
                                labelWidth: null,
                                required: true,
                                regList: [],
                                changeTag: true,
                                document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
                            },
                            __vModel__: null,
                            placeholder: this.$t('generator.selectTip'),
                            style: { width: '100%' },
                            disabled: false,
                            clearable: true,
                            'picker-options': {
                                selectableRange: '00:00:00-23:59:59'
                            },
                            format: 'HH:mm',
                            'value-format': 'HH:mm'
                        },
                        {
                            __config__: {
                                label: this.$t('generator.timeRanges'),
                                tag: 'el-time-picker',
                                tagIcon: 'time-range',
                                span: 20,
                                showLabel: true,
                                labelWidth: null,
                                layout: 'colFormItem',
                                defaultValue: null,
                                required: true,
                                regList: [],
                                changeTag: true,
                                document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
                            },
                            __vModel__: null,
                            style: { width: '100%' },

                            disabled: false,
                            clearable: true,
                            'is-range': true,
                            'range-separator': this.$t('generator.to'),
                            'start-placeholder': this.$t('generator.startTime'),
                            'end-placeholder': this.$t('generator.endTime'),
                            format: 'HH:mm',
                            'value-format': 'HH:mm'
                        },

                        {
                            __config__: {
                                label: this.$t('generator.DatePicker'),
                                tag: 'el-date-picker',
                                tagIcon: 'date',
                                defaultValue: null,
                                showLabel: true,
                                labelWidth: null,
                                span: 20,
                                layout: 'colFormItem',
                                required: true,
                                regList: [],
                                changeTag: true,
                                document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
                            },
                            __vModel__: null,
                            placeholder: this.$t('generator.selectTip'),
                            type: 'date',
                            style: { width: '100%' },
                            disabled: false,
                            clearable: true,
                            format: 'yyyy-MM-dd',
                            'value-format': 'yyyy-MM-dd',
                            readonly: false
                        },
                        {
                            __config__: {
                                label: this.$t('generator.dateRange'),
                                tag: 'el-date-picker',
                                tagIcon: 'date-range',
                                defaultValue: null,
                                span: 20,
                                showLabel: true,
                                labelWidth: null,
                                required: true,
                                layout: 'colFormItem',
                                regList: [],
                                changeTag: true,
                                document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
                            },
                            __vModel__: null,
                            style: { width: '100%' },
                            type: 'daterange',
                            'range-separator': this.$t('generator.to'),
                            'start-placeholder': this.$t('generator.startDate'),
                            'end-placeholder': this.$t('generator.endDate'),
                            disabled: false,
                            clearable: true,
                            format: 'yyyy-MM-dd',
                            'value-format': 'yyyy-MM-dd',

                            readonly: false
                        },
                        {
                            __config__: {
                                label: this.$t('generator.userDefinedSearch'),
                                custom: true,
                                checkedValue: null,
                                labelWidth: null,
                                showLabel: true,
                                changeTag: true,
                                tag: 'el-input',
                                tagIcon: 'custom',
                                defaultValue: null,
                                required: true,
                                layout: 'colFormItem',
                                span: 20,
                                document: 'https://element.eleme.cn/#/zh-CN/component/input',
                                // 正则校验规则
                                regList: []
                            },
                            __vModel__: null,
                            // 组件的插槽属性
                            __slot__: {
                                prepend: '',
                                append: ''
                            },

                            // 其余的为可直接写在组件标签上的属性
                            placeholder: this.$t('generator.selectTip'),
                            style: { width: '100%' },
                            clearable: true,
                            'prefix-icon': 'el-icon-search',
                            'suffix-icon': '',
                            maxlength: null,
                            readonly: true,
                            disabled: false,
                            cFun: ''
                        },
                        {
                            __config__: {
                                label: this.$t('generator.Customcodetable'),
                                custom: true,
                                checkedValue: null,
                                labelWidth: null,
                                showLabel: true,
                                changeTag: true,
                                hidden: false,
                                tag: 'el-input',
                                tagIcon: 'Customcodetable',
                                defaultValue: null,
                                required: true,
                                layout: 'colFormItem',
                                span: 20,
                                document: 'https://element.eleme.cn/#/zh-CN/component/input',
                                // 正则校验规则
                                regList: []
                            },
                            __vModel__: null,
                            // 组件的插槽属性
                            __slot__: {
                                prepend: '',
                                append: ''
                            },
                            // 其余的为可直接写在组件标签上的属性
                            placeholder: this.$t('generator.selectTip'),
                            style: { width: '100%' },
                            clearable: true,
                            'prefix-icon': 'el-icon-search',
                            'suffix-icon': '',
                            maxlength: null,
                            readonly: true,
                            disabled: false,
                            singleChoice: false,
                            codeName: '',//码表名称
                            codeModel: '',//回显字段
                            codeType: '3',//查询方式
                            codeData: '',//请求参数
                            codeTableId: '',
                        },
                        {
                            __config__: {
                                label: this.$t('generator.associatedProcess'),
                                custom: true,
                                checkedValue: null,
                                labelWidth: null,
                                showLabel: true,
                                changeTag: true,
                                tag: 'el-input',
                                tagIcon: 'AssociatedProcess',
                                defaultValue: null,
                                required: true,
                                layout: 'colFormItem',
                                span: 20,
                                document: 'https://element.eleme.cn/#/zh-CN/component/input',
                                // 正则校验规则
                                regList: []
                            },
                            __vModel__: null,
                            // 组件的插槽属性
                            __slot__: {
                                prepend: '',
                                append: ''
                            },
                            // 其余的为可直接写在组件标签上的属性
                            placeholder: this.$t('generator.selectTip'),
                            style: { width: '100%' },
                            clearable: true,
                            'prefix-icon': 'el-icon-search',
                            'suffix-icon': '',
                            maxlength: null,
                            readonly: true,
                            disabled: false,
                            singleChoice: false,
                            codeName: '',//码表名称
                            codeModel: '',//回显字段
                            codeType: '3',//查询方式
                            codeData: '',//请求参数
                            codeTableId: ''
                        }
                    ],
                }
            ];
        },

        activeTag() {
            return this.activeData.__config__.tag;
        },
        isShowMin() {
            return ["el-input-number", "el-slider"].indexOf(this.activeTag) > -1;
        },
        isShowMax() {
            return (
                ["el-input-number", "el-slider", "el-rate"].indexOf(this.activeTag) > -1
            );
        },
        isShowStep() {
            return ["el-input-number", "el-slider"].indexOf(this.activeTag) > -1;
        }
    },
    watch: {
        formConf: {
            handler(val) {
                saveFormConf(val);
            },
            deep: true
        },
    },
    methods: {
        initActiveData(val){
            this.allObj = {}
            this.codeDataArr = []
            this.codeModelArr = []
            this.normalCodeModelOptions = []
            this.normalCodeNameOptions = []
            if(val.__config__.tagIcon == "Customcodetable" ||val.__config__.tagIcon == "AssociatedProcess" ) {
                if(val.hasOwnProperty("codeName")) {
                    let e = val.codeName;
                    if(e == '') return
                    this.codeModelArr = this.codeModelOptions[e];
                    this.codeDataArr = this.codeDataOptions[e];
                    if(this.allObj.hasOwnProperty(val.__vModel__)) return
                    this.allObj[val.__vModel__] = this.codeModelOptions[e];
                }
            } else {
                if(val.hasOwnProperty('isCodeName')) {
                    if(val.isCodeName) {
                        this.changeIsCodeName()
                    }
                    if(val.normalCodeName) {
                        this.normalCodeModelOptions = this.allObj[val.normalCodeName]
                    }
                }
            }
        },
        exampleShow() {
            this.dialogVisibleExample = true
        },
        changeInputMfun(e) {
            let con = e;
            this.activeData.mobilefun = "function(value,that){" + con.replace(/(^\s*)|(\s*$)/g, "") + "}"
        },
        changeInputFun(e) {
            let con = e;
            axios.get('http://10.31.52.137:8080/odc-rmis/business/employeeExternal/find',{
                params:{
                    employeeName:'外部员工测试',
                    admissionDate: '1221'
                }
            }).then(res => {
                alert(JSON.stringify(res.data));
                console.log('查询数据成功！');
            }).catch(error => {
                console.log('查询数据失败！');
            });
            this.activeData.fun = "function test(value,that,config){" + con.replace(/(^\s*)|(\s*$)/g, "") + "}"
        },
        changeFieldFun(e) {},
        checkFieldModel(e) {},
        inputDate(val) {
            var Expression=/^[0-9]*[1-9][0-9]*$/;
            var objExp = new RegExp(Expression);
            if(objExp.test(val)){
                this.activeData.rangeDate = val;
            }
        },
        inputTime(val) {
            var splitValue = val.split('-')
            var reDateTime = /^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/;
            if (splitValue.length > 1) {
                if(reDateTime.test(splitValue[0] && splitValue[1])){
                    this.activeData['picker-options'].selectableRange = val;
                }
            }
        },
        //普通组件关联自定义码表后选择码表
        changeNormalCodeName(e) {
            this.normalCodeModelOptions = this.allObj[e]
        },
        //自定义码表选择码表
        changeFieldcodeName(e) {
            if(this.activeData.__vModel__ === null) {
                this.activeData.codeName = '';
                this.$message.error('请先选择字段名');
            } else {
                for (let index = 0; index < this.drawingList.length; index++) {
                    const element = this.drawingList[index];
                    if(element.normalCodeName == this.activeData.__vModel__) {
                        element.normalCodeModel = ''
                    }
                }
                this.activeData.codeModel = '';
                this.activeData.codeData = '';
                this.codeModelArr = this.codeModelOptions[e];
                this.codeDataArr = this.codeDataOptions[e];
                if(this.allObj.hasOwnProperty(this.activeData.__vModel__)) return
                this.allObj[this.activeData.__vModel__] = this.codeModelOptions[e];
            }
        },
        //是否关联自定义码表
        changeIsCodeName(e) {
            this.allObj = {};
            //判断是否为明细表中数据
            if(this.activeData.hasOwnProperty('parentID')) {
                for (let index = 0; index < this.drawingList.length; index++) {
                    const element = this.drawingList[index];
                    if(this.activeData.parentID == element.__config__.componentName) {
                        for (let i = 0; i < element.__config__.children.length; i++) {
                            const con = element.__config__.children[i];
                            if(con.__config__.tagIcon == "Customcodetable" || con.__config__.tagIcon == 'AssociatedProcess') {
                                if(con.__vModel__!== '' && con.codeName !== '') {
                                    let arr = this.onlyDetail.filter((value, index, arr) => {
                                    　　　return value.value == con.__vModel__
                                　  })
                                    let obj
                                    if(arr.length == 0) {
                                        obj = {}
                                    } else {
                                        obj = arr[0]
                                    }
                                    let result = false;
                                    if(this.normalCodeNameOptions.length > 0) {
                                        result = this.normalCodeNameOptions.some(function(item) {
                                            if (item.value == con.__vModel__) {
                                                return true;
                                            }
                                        })
                                    }
                                    if(result) {
        
                                    } else {
                                        this.normalCodeNameOptions.push(obj);
                                    }
                                    if(this.allObj.hasOwnProperty(con.__vModel__)) return
                                    this.allObj[con.__vModel__] = this.codeModelOptions[con.codeName];
                                }
                            }
                        }
                    }
                }
            } else {
                for (let index = 0; index < this.drawingList.length; index++) {
                    const element = this.drawingList[index];
                    if(element.__config__.hasOwnProperty('children')) {

                    } else {
                        if(element.__config__.tagIcon == "Customcodetable" || element.__config__.tagIcon == 'AssociatedProcess') {
                            if(element.__vModel__!== '' && element.codeName !== '') {
                                let arr = this.options.filter((value, index, arr) => {
                                　　　return value.value == element.__vModel__
                            　  })
                                let obj
                                if(arr.length == 0) {
                                    obj = {}
                                } else {
                                    obj = arr[0]
                                }
                                let result = false;
                                if(this.normalCodeNameOptions.length > 0) {
                                    result = this.normalCodeNameOptions.some(function(item) {
                                        if (item.value == element.__vModel__) {
                                            return true;
                                        }
                                    })
                                }
                                if(result) {
    
                                } else {
                                    this.normalCodeNameOptions.push(obj);
                                }
                                if(this.allObj.hasOwnProperty(element.__vModel__)) return
                                this.allObj[element.__vModel__] = this.codeModelOptions[element.codeName];
                            }
                        }
                    }
                }
            }
        },
        customReg() {
            this.activeData.__config__.regList[0].pattern = this.customList
        },
        customRegMsg() {
            this.activeData.__config__.regList[0].message = this.customMsg
        },
        addReg(item) {

            for (let i of this.regularChoise) {
                if (i.value == item) {
                    this.regLabel = i.label
                    this.customList = i.value
                    this.customMsg = i.message
                    this.activeData.__config__.regList[0] = {
                        pattern: i.value,
                        message: i.message
                    };
                    if(this.activeData.isFormat === undefined || i.value !='/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/'){
                        this.activeData.isFormat = false;
                    }
                }
            }
        },
        clearReg(){ // 清空选择的正则表达式
                   this.regLabel = ''
                    this.customList = ''
                    this.customMsg = ''
                    this.activeData.__config__.regList=[];
                    this.activeData.isFormat = false;
        },
        changeField(value) {
            this.$emit("changeField", value);
        },
        getDetail() {
            return this.onlyDetail;
        },
        getOptions() {
            return this.options;
        },
        clean() {
            this.activeData.__vModel__ = null;
        },
        addSelectItem() {
            if (this.activeData.__slot__.hasOwnProperty("options")) {
                this.activeData.__slot__.options.push({
                    label: "",
                    value: ""
                });
            } else {
                this.activeData.__slot__.options = [];
                this.activeData.__slot__.options.push({
                    label: "",
                    value: ""
                });
            }
        },
        addTreeItem() {
            ++this.idGlobal;
            this.dialogVisible = true;
            this.currentNode = this.activeData.options;
        },
        renderContent(h, { node, data, store }) {
            return (
                <div class="custom-tree-node">
                    <span>{node.label}</span>
                    <span class="node-operation">
                        <i
                            on-click={() => this.append(data)}
                            class="el-icon-plus"
                            title="$t('RightPanel.add')"
                        ></i>
                        <i
                            on-click={() => this.remove(node, data)}
                            class="el-icon-delete"
                            title="$t('RightPanel.delete')"
                        ></i>
                    </span>
                </div>
            );
        },
        append(data) {
            if (!data.children) {
                this.$set(data, "children", []);
            }
            this.dialogVisible = true;
            this.currentNode = data.children;
        },
        remove(node, data) {
            this.activeData.__config__.defaultValue = []; // 避免删除时报错
            const { parent } = node;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
        },
        addNode(data) {
            this.currentNode.push(data);
        },
        setOptionValue(item, val) {
            item.value = isNumberStr(val) ? +val : val;
        },
        setDefaultValue(val) {
            if (Array.isArray(val)) {
                return val.join(",");
            }
            if (typeof val === "boolean") {
                return `${val}`;
            }
            return val;
        },
        onDefaultValueInput(str) {
            if (isArray(this.activeData.__config__.defaultValue)) {
                // 数组
                this.$set(
                    this.activeData.__config__,
                    "defaultValue",
                    str.split(",").map(val => (isNumberStr(val) ? +val : val))
                );
            } else if (["true", "false"].indexOf(str) > -1) {
                // 布尔
                this.$set(this.activeData.__config__, "defaultValue", JSON.parse(str));
            } else {
                // 字符串和数字
                this.$set(
                    this.activeData.__config__,
                    "defaultValue",
                    isNumberStr(str) ? +str : str
                );
            }
        },
        onSwitchValueInput(val, name) {
            if (["true", "false"].indexOf(val) > -1) {
                this.$set(this.activeData, name, JSON.parse(val));
            } else {
                this.$set(this.activeData, name, isNumberStr(val) ? +val : val);
            }
        },
        setTimeValue(val, type) {
            const valueFormat = type === "week" ? dateTimeFormat.date : val;
            this.$set(this.activeData.__config__, "defaultValue", null);
            this.$set(this.activeData, "value-format", valueFormat);
            this.$set(this.activeData, "format", val);
        },
        spanChange(val) {
            this.formConf.span = val;
        },
        multipleChange(val) {
            this.$set(this.activeData.__config__, "defaultValue", val ? [] : "");
        },
        variableDateChange(val) {
            this.activeData.type = 'date';
            this.setTimeValue(dateTimeFormat['date'], 'date');
        },
        dateTypeChange(val) {
            if (this.activeData.variableDate !== '') {
                this.activeData.variableDate = ''
            }
            this.activeData.rangeDate = '';
            this.setTimeValue(dateTimeFormat[val], val);
        },
        rangeChange(val) {
            this.$set(
                this.activeData.__config__,
                "defaultValue",
                val ? [this.activeData.min, this.activeData.max] : this.activeData.min
            );
        },
        rateTextChange(val) {
            if (val) this.activeData["show-score"] = false;
        },
        rateScoreChange(val) {
            if (val) this.activeData["show-text"] = false;
        },
        colorFormatChange(val) {
            this.activeData.__config__.defaultValue = null;
            this.activeData["show-alpha"] = val.indexOf("a") > -1;
            this.activeData.__config__.renderKey = +new Date(); // 更新renderKey,重新渲染该组件
        },
        openIconsDialog(model) {
            this.iconsVisible = true;
            this.currentIconModel = model;
        },
        setIcon(val) {
            this.activeData[this.currentIconModel] = val;
        },
        tagChange(tagIcon) {
            const oldData = JSON.stringify(this.activeData);
            let target = undefined;
            this.inputComponents.forEach(item => {
                if (item.__config__.tagIcon === tagIcon) {
                    let data = JSON.stringify(item);
                    target = JSON.parse(data);
                }
            });
            if (!target)
                this.selectComponents.forEach(item => {
                    if (item.__config__.tagIcon === tagIcon) {
                        let data = JSON.stringify(item);
                        target = JSON.parse(data);
                    }
                });
            let cData = JSON.parse(oldData);
            target.tableType = "subTable";
            target.fieldType = cData.fieldType;
            target.__config__.label = cData.__config__.label;
            target.__config__.componentName = cData.__config__.componentName;
            target.__config__.formId = cData.__config__.formId;
            target.__config__.regList = cData.__config__.regList;
            target.maxlength = cData.maxlength;
            target.__vModel__ = cData.__vModel__;
            if (target.placeholder) {
                target.placeholder = target.placeholder + cData.__config__.label;
            }
            let type = this.activeData.fieldType;
            if (
                (tagIcon === "custom" ||
                    tagIcon === "mechanism" ||
                    tagIcon === "user") &&
                (type === "date" || type === "numeric")
            ) {
                this.$message.error("date" + $t('RightPanel.or') + 'numeric' + $t('RightPanel.noSupportTip'));
                target = null;
            }
            this.$emit("tag-change", target);
        },
        changeRenderKey() {
            this.activeData.__config__.renderKey = +new Date();
        },
        selectArrTypeChange(){// 选择数据类型显示数据
          this.activeData.__slot__.options = []
          this.optionDataArr.forEach((item)=>{
               if(item.optionType === this.activeData.__config__.selectArrType){
                   this.activeData.__slot__.options.push({label:item.optionName,value:item.optionCode})
               }
          })
        }
    },
    mounted() {

        this.initActiveData(this.activeData);
        if(this.activeData.__config__.selectArrType){ // 显示前多语言化
              this.activeData.__slot__.options=[]
              this.optionDataArr.forEach((li)=>{
                    if(li.optionType === this.activeData.__config__.selectArrType){
                      this.activeData.__slot__.options.push({label:li.optionName,value:li.optionCode})
                    }
              })
            }
        if(this.activeData.__config__.regList && this.activeData.__config__.regList.length>0){// 如果之前选择了验证规则  再次切换回来进行回写
        this.activeData.__config__.regList.forEach((item)=>{
            let validValue = false
            this.regularChoise.forEach((li)=>{
                if(li.message == item.message){
                    validValue = true
                    this.customMsg = li.message
                    this.regList = li.value
                    this.customList = li.value
                    this.regLabel = li.label
                }
            })
            if (!validValue) {
                this.customMsg = item.message
                this.regList = this.$t('RightPanel.UserDefinedRules')
                this.customList = item.pattern
                this.regLabel = this.$t('RightPanel.UserDefinedRules')
            }
        })
        }
    }
};
</script>
<style lang="scss">
    .example-box {
        .el-dialog__body {
            padding-left: 0;
        }
    }
    .collapse-box {
        margin-bottom: 18px;
        .el-collapse-item__content {
            padding-bottom: 0;
        }
    }
    
</style>
<style lang="scss" scoped>
.right-board {
    width: 350px;
    position: absolute;
    right: 0;
    top: 0;
    padding-top: 3px;
    .ico-pre {
        cursor: pointer;
    }
    .field-box {
        position: relative;
        height: calc(100vh - 42px);
        box-sizing: border-box;
        overflow: hidden;
    }
    .el-scrollbar {
        height: 100%;
    }
}
.select-item {
    display: flex;
    border: 1px dashed #fff;
    box-sizing: border-box;
    & .close-btn {
        cursor: pointer;
        color: #f56c6c;
    }
    & .el-input + .el-input {
        margin-left: 4px;
    }
}
.select-item + .select-item {
    margin-top: 4px;
}
.select-item.sortable-chosen {
    border: 1px dashed #409eff;
}
.select-line-icon {
    line-height: 32px;
    font-size: 22px;
    padding: 0 4px;
    color: #777;
}
.option-drag {
    cursor: move;
}
.time-range {
    .el-date-editor {
        width: 227px;
    }
    ::v-deep .el-icon-time {
        display: none;
    }
}
.document-link {
    position: absolute;
    display: block;
    width: 26px;
    height: 26px;
    top: 0;
    left: 0;
    cursor: pointer;
    background: #409eff;
    z-index: 1;
    border-radius: 0 0 6px 0;
    text-align: center;
    line-height: 26px;
    color: #fff;
    font-size: 18px;
}
.node-label {
    font-size: 14px;
}
.node-icon {
    color: #bebfc3;
}
</style>
