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
import {
    reactive,
    toRef,
    toRefs,
    nextTick,
} from 'vue';
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
            const { http, scene, callback } = btn;
            console.log('scene', scene);
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