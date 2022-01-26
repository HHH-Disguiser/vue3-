<template>
    <div v-if="currentVisiable"
         class="btn-item">
        <!-- 目前只处理弹窗的情况 -->
        <el-button :key="name|| i"
                   v-bind="getMergedObject(extend,
                                               { 
                                                   disabled: currentDisabled,
                                                   type: 'primary',
                                                   size: 'small'
                                               })"
                   @click=" () => handleBtnClick(this)">
            {{ currentLabel }}
        </el-button>

    </div>
</template>

<script>
import { reactive, toRef, toRefs, nextTick } from 'vue';
import { getMergedObject } from '../utils/util';
import { ElButton } from 'element-plus';
export default {
    name: 'BkButton',
    components: {
        ElButton,
    },
    props: {
        mode: {
            type: String,
            default: 'btn',
        },
        // 表格行数据
        tableRow: {
            type: Object,
            default: () => {},
        },
        // 下拉按钮样式
        btnExtend: {
            type: Object,
            default: () => {},
        },
        // 下拉列表组
        data: {
            type: Array,
            default: () => [],
        },
        // 对话框配置
        dialogConfig: {
            type: Object,
            default: () => {},
        },
        // 对话框显示
        dialogVisible: {
            type: Object,
            default: () => {},
        },
        // 对应的对话宽name
        target: {
            type: String,
            default: '',
        },
        // 上传前置请求
        fileBefore: {
            type: Object,
            default: () => {},
        },
        // 类型
        scene: {
            type: String,
            default: '',
        },
        // 唯一标示
        name: {
            type: String,
            required: true,
        },
        // 按钮文本
        label: {
            type: [String, Number],
            required: true,
        },
        // 请求时显示
        loadingText: {
            type: String,
            default: '',
        },
        // 是否需要展示文件列表
        hasFileList: {
            type: Boolean,
            default: true,
        },
        // element Ui扩展配 按钮时指向按钮，下拉时指向下拉
        extend: {
            type: Object,
            default: () => {},
        },
        // 配置请求
        http: {
            type: Object,
            default: () => {},
        },
        // 导出功能使用
        search: {
            type: Object,
            default: () => {},
        },
        // 触发回调
        callback: {
            type: Function,
            default: () => {},
        },
        disabled: {
            type: [Boolean, Function],
            default: false,
        },
        visible: {
            type: [Boolean, Function],
            default: true,
        },
    },
    setup(props, ctx) {
        console.log('ctx>>>>>', props);
        const state = reactive({
            getMergedObject: getMergedObject,
            currentLabel: props.label,
            // currentDisabled: ctx.hangdleAttrFn(props.disabled),
            currentDisabled: false,
            //currentVisiable: ctx.hangdleAttrFn(props.visible),
            currentVisiable: true,
            dialogVisible: props.dialogVisible,
            dialogConfig: props.dialogConfig,
            /**
             * dialogConfig = { name: boolean }  TODO 未做
             * */
            handleDialogBtn: (btn, config) => {
                const { dialogConfig, dialogVisible } = state;
                const { target } = btn;
                console.log('target>>>', target);
                console.log('dialogVisible>>>>>', dialogVisible);
                dialogVisible[target] = true;
                const { params, url } = config;
                ctx.emit('showDialogModal', target);
                if (url) {
                    // 请求获取数据
                    this.handleBtnFetch({
                        config,
                        btn,
                        callback: (res) => {
                            // 弹窗内只有一个且是表单模块时向内填充数据
                            const targetDialog = dialogConfig.data.find((item) => item.name === target);
                            if (
                                Array.isArray(targetDialog.data) &&
                                targetDialog.data.length === 1 &&
                                targetDialog.data[0].type === 'form'
                            ) {
                                const { formConfig } = targetDialog.data[0] || {};
                                if (formConfig) this.$set(formConfig, 'results', res.data);
                            }
                        },
                    });
                } else {
                    // 弹窗内只有一个且是表单模块时向内填充数据
                    const targetDialog = dialogConfig.data.find((item) => item.name === target);
                    if (
                        Array.isArray(targetDialog.data) &&
                        targetDialog.data.length === 1 &&
                        targetDialog.data[0].type === 'form'
                    ) {
                        const { formConfig } = targetDialog.data[0] || {};
                        console.log('formConfig>>>>>', formConfig);
                        // if (formConfig) this.$set(formConfig, 'results', params);
                    }
                }
            },
        });

        /**
         * 属性支持function
         * @param { Functon,Boolean } attr
         */
        function hangdleAttrFn(attr) {
            if (typeof attr === 'function') {
                return attr(this);
            }
            return attr;
        }

        // 按钮新点击事件
        const handleBtnClick = async (btn) => {
            console.log('btn>>>>', btn);
            const { http, scene, callback } = btn;
            let currentParams = '';
            const { params, method, onBefore } = http || {};
            // before钩子事件
            if (onBefore) {
                currentParams = await onBefore(btn, this);
                // before 返回false跳出操作
                if (currentParams === false) return;
            } else {
                currentParams = params;
            }
            // 生产配置
            const config = {
                url: http ? http.url : '', // 获取before处理后的before
                params: currentParams || {},
                method: method || 'get',
            };
            // 弹窗按钮，支持回显数据
            //目前只做 弹窗模式
            switch (scene) {
                case 'dialog':
                    state.handleDialogBtn(btn, config);
                    break;
                default:
                    if (callback) callback(this);
            }
        };

        return {
            hangdleAttrFn,
            handleBtnClick,
            // toRefs() 把响应式对象转换成普通对象，里面的属性还是响应式属性
            ...toRefs(state),
        };
    },
};
</script>