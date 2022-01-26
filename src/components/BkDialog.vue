<template>
    <div class="dialog-wrapper">
        <template v-if="dialogConfig && Array.isArray(dialogConfig.data) && dialogConfig.data.length"
                  v-for="cell in dialogConfig.data">
            <el-dialog :ref="cell.name"
                       v-model="dialogVisible[cell.name]"
                       @close="() => { handleDialogClose(cell) }"
                       :append-to-body="true"
                       v-bind="cell.extend"
                       class="dialog-item">
                <!-- 内容部分 -->
                <template v-if="cell && Array.isArray(cell.data) && cell.data.length"
                          v-for="item in cell.data">

                    <template v-if="item.type === 'form'">
                        <MyBkForm v-if="dialogVisible[cell.name]"
                                  :ref="item.name"
                                  :formConfig="item.formConfig"
                                  :dialogConfig="item.dialogConfig" />
                    </template>
                </template>
                <!-- 底部按钮(可加入自定义按钮，默认按钮可隐藏) -->
                <div slot="footer"
                     class="dialog-footer">
                    <div v-if="Array.isArray(cell.extraButtons)"
                              v-for="extraButton in cell.extraButtons">
                        <el-button :key="extraButton.name"
                                   @click="() => handleExtraBtnClick(extraButton, cell)"
                                   :loading="extraButton.loadingStatus"
                                   v-bind="getMergedObject(extraButton.extend, {type:'primary'})">
                            {{ extraButton.label }}
                        </el-button>
                    </div>
                    <template v-if="!cell.noDefaultButtons">
                        <el-button @click="dialogVisible[cell.name] = false">
                            取 消
                        </el-button>
                        <el-button :loading="cell.confirmButtonConfig && cell.confirmButtonConfig.loadingSwitch
                            ? submittingObj[cell.name] : false"
                                   @click="() => handleDialogConfirm(cell)"
                                   v-bind="getMergedObject(
                                       cell.confirmButtonConfig && cell.confirmButtonConfig.extend
                                       , {type:'primary'})">
                            {{ cell.confirmButtonConfig && cell.confirmButtonConfig.label ?
                                cell.confirmButtonConfig.label
                                : '确 定' }}
                        </el-button>
                    </template>
                </div>
            </el-dialog>
        </template>
    </div>
</template>

<script>
import { getMergedObject } from '../utils/util';
import { reactive, toRefs, unref } from 'vue';
import { ElDialog } from 'element-plus';
import MyBkForm from './BkForm.vue';
export default {
    name: 'BkDialog',
    components: {
        ElDialog,
        MyBkForm,
    },
    props: {
        dialogVisible: {
            required: true,
            type: Object,
            default: () => ({}),
        },
        dialogConfig: {
            required: true,
            type: Object,
            default: () => ({}),
        },
        initParams: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props, ctx) {
        const state = reactive({
            getMergedObject: getMergedObject,
            submittingObj: {}, // 各弹窗的提交按钮状态集合
            dialogConfig: props.dialogConfig,
            dialogVisible: props.dialogVisible,
        });

        /**
         * 弹窗关闭事件
         * @param {Object} dialogConfig 当前弹窗配置
         */
        const handleDialogClose = async (dialogConfig) => {
            const { onBeforeClose, onAfterClose, data } = dialogConfig;
            // 弹窗关闭前事件
            if (typeof onBeforeClose === 'function') {
                const toContinue = await onBeforeClose(this, dialogConfig);
                if (toContinue === false) return;
            }
            // 清空输入状态
            data.forEach((item) => {
                if (item.type === 'list' && this.$refs[item.name][0].$refs.form) {
                    this.$refs[item.name][0].handleClear();
                } else if (item.type === 'form') {
                    this.$refs[item.name][0].resetFormParams();
                }
            });
            // 弹窗关闭后事件
            if (typeof onAfterClose === 'function') {
                onAfterClose(this, dialogConfig);
            }
        };

        return {
            handleDialogClose,
            ...toRefs(state),
        };
    },
};
</script>