<template>
    <div class="dialog-wrapper">
        <template v-if="dialogConfig && Array.isArray(dialogConfig.data) && dialogConfig.data.length"
                  v-for="cell in dialogConfig.data">
            <el-dialog :ref="cell.name"
                       :visible.sync="dialogVisible[cell.name]"
                       @close="() => { handleDialogClose(cell) }"
                       :append-to-body="true"
                       v-bind="cell.extend"
                       class="dialog-item">
                <template v-if="cell && Array.isArray(cell.data) && cell.data.length"
                          v-for="item in cell.data">
                    <!-- TODO 目前只处理内容是form类型的dialog -->
                    <template v-if="item.type === 'form'">
                        <div>表单aaaaaaa</div>
                        <!-- <MyBkForm v-if="dialogVisible[cell.name]"
                                  :ref="item.name"
                                  :formConfig="item.formConfig"
                                  :dialogConfig="item.dialogConfig" /> -->
                    </template>
                </template>
            </el-dialog>
        </template>
    </div>
</template>

<script>
import { getMergedObject } from '../utils/util';
import {
    reactive,
    computed,
    ref,
    watchEffect,
    watch,
    onMounted,
    onBeforeMount,
    onBeforeUpdate,
    onUpdated,
    onUnmounted,
    onBeforeUnmount,
    toRef,
    toRefs,
    unref,
    defineComponent,
} from 'vue';
import { ElDialog } from 'element-plus';
import MyBkForm from './BkForm.vue';
export default {
    name: 'BkDialog',
    components: { ElDialog, MyBkForm },
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
        });


       /**
         * 弹窗关闭事件
         * @param {Object} dialogConfig 当前弹窗配置
         */
        const handleDialogClose = async (dialogConfig)=> {
            const {
                onBeforeClose, onAfterClose, data 
            } = dialogConfig;
            // 弹窗关闭前事件
            if (typeof onBeforeClose === 'function') {
                const toContinue = await onBeforeClose(this, dialogConfig);
                if (toContinue === false) return;
            }
            // 清空输入状态
            data.forEach(item => {
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
        },

        return {
            handleDialogClose,
            ...toRefs(state),
        };
    },
};
</script>