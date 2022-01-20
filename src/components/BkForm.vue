<template>
    <div class="form-wrapper">
        <!--表单主体  -->
        <el-form ref="formRef"
                 :model="formParams"
                 label-width="120px">
            <!-- 表单组，可以配置多个表单组 -->
            <div v-for="dataConfig in formConfig.data">
                <!-- 开始处理表单项 -->
                <div v-if="Array.isArray(dataConfig.data)"
                     class="form-body-wrapper">
                    <el-row>
                        <div v-for="(materialConfig,index) in dataConfig.data">
                            <el-col :span="materialConfig.grid ? parseInt(24 / materialConfig.grid) : 24"
                                    :key="materialConfig.name">
                                <BkFormMaterial :ref="`${materialConfig.name}`"
                                                :key="materialConfig.name"
                                                :materialConfig="materialConfig"
                                                :materialConfigs="materialConfigs"
                                                :formConfig="formConfig"
                                                :formParams="formParams" />
                            </el-col>
                        </div>
                    </el-row>
                </div>
            </div>

            <!-- 具名插槽 -->
            <slot name="search"></slot>
        </el-form>
    </div>
</template>

<script lang="ts">
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
import { getMergedObject } from '../utils/util';
import { ElForm, ElFormItem, ElButton, ElRow, ElCol } from 'element-plus';
import BkFormMaterial from './BkFormMaterial.vue';

type ObjectType = {
    [key: string]: any;
};

export default defineComponent({
    name: 'BkForm',
    components: { ElForm, ElFormItem, ElButton, BkFormMaterial, ElRow, ElCol },
    props: {
        //搜索查询参数配置
        formConfig: {
            type: Object,
            default: () => ({}),
        },
        searchConfig: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props, ctx) {
        const state = reactive({
            isHasChildren: false,
            getMergedObject: getMergedObject,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
            },
            formConfig: props.formConfig,
            /**
             * TODO  要么直接在这里就把formParams 处理成
             * {
             *  inputDemo:'',
             *  input1:''
             * }
             */
            formParams: {}, // 表单的所有参数集合
            materialConfigs: [], // 将formConfig转化后的一维元组件配置数组，拿掉了data这一层
        });

        const formRef = ref<any>(null);

        //TODO  这里会有一个疑问  reactive  ref 都可以放数据 他们有什么不同呢
        // ref 主要用在获取实例上
        const draw = ref(true);

        // TODO 这里思考 watch 与 watchEffect的区别
        /**
         * watchEffect 在组件初始化的时候会执行一次  回调函数值中收集到的数据发生变化了则再执行
         * watch 监听指定的依赖数据源 ，watchEffect不需要指定监听数据源
         * watch 可以监听到新旧值
        */
        watchEffect(() => {
            console.log('formParams===form', state.formParams);
        });

        watch(
            state.formParams,
            (newVal, oldVal) => {
                console.log('表单值==formParams', newVal);
            },
            { deep: true, immediate: true }
        );

        /**
         * 将formConfig的二维数组配置转化为一维数组materialConfigs
         */
        const formatFormConfigToMaterialConfigs = (setting: []) => {
            const settingTemp = setting || state.formConfig.data || [];
            state.materialConfigs = [];
            if (!Array.isArray(settingTemp)) return;

            settingTemp.forEach((config) => {
                const { data } = config;
                if (Array.isArray(data)) {
                    // 用来标记每组符合grid范围配置的开始下标
                    data.forEach((field: any) => {
                        // 一个字段存在多个元组件的情况
                        if (Array.isArray(field.items)) {
                            field.items.forEach((item: any) => {
                                state.materialConfigs.push(item);
                            });
                        } else {
                            state.materialConfigs.push(field);
                        }
                    });
                }
            });

            // 处理formParams的格式
            state.materialConfigs.forEach((materialConfigsITEM) => {
                const { name } = materialConfigsITEM;
                if (!state.formParams[name]) {
                    state.formParams[name] = '';
                }
            });
        };

        onMounted(() => {
            formatFormConfigToMaterialConfigs();
        });

        /**
         * 转换数据成服务器接收的格式
         */
        const formatFormParams = () => {
            const { formParams } = state;
            const params: any = {};

            state.materialConfigs.forEach((materialConfig) => {
                const { name, type, options, extraFields, props, noSubmit, toString, objToString, separator } =
                    materialConfig;
                // 如果目标不存在name
                if (!name) {
                    console.warn('name字段不能为空！');
                    return;
                }

                const value = formParams[name];
                // 过滤空值和非提交字段
                if (value === undefined || noSubmit || dependOnChange(materialConfig)) {
                    return;
                }

                if ((type === 'checkbox' || type === 'transfer') && Array.isArray(value) && toString === true) {
                    // 将数组值转化为数组字符串
                    params[name] = value.join(',');
                    if (params[extraFields] && Array.isArray(params[extraFields])) {
                        const arrExtra: any = [];
                        params[extraFields].forEach((item) => {
                            if (item) arrExtra.push(item);
                        });
                        params[extraFields] = arrExtra.join(',');
                    }
                } else if (type === 'transfer' && Array.isArray(value) && objToString) {
                    const arr = [];
                    value.forEach((val) => {
                        const obj = options.find((i) => i[(props && props.key) || 'key'] === val);
                        if (!obj) return;
                        arr.push(obj);
                    });
                    params[name] = Array.isArray(arr) ? JSON.stringify(arr) : arr;
                } else if (
                    (type === 'areaselect' || type === 'listselect') &&
                    typeof value !== 'string' &&
                    toString === true
                ) {
                    params[name] = JSON.stringify(value);
                } else if (type === 'tag' && toString === true) {
                    params[name] = value.join(separator);
                } else if (typeof value !== 'string' && toString === true) {
                    params[name] = JSON.stringify(value);
                } else if (typeof value === 'string') {
                    params[name] = value.trim();
                } else {
                    params[name] = value;
                }
            });

            return params;
        };

        /**
         * 依赖字段值匹配时隐藏
         * @param {Object} materialConfig 元组件配置
         */
        const dependOnChange = (materialConfig: any) => {
            const { depend, required, tempRequired } = materialConfig;
            const { name, value, visibleSwitch } = depend || {};
            if (!depend || !name || value === undefined || value === null || !visibleSwitch) {
                if (tempRequired) {
                    materialConfig.required = tempRequired;
                }
                return false;
            }
            // 默认依赖字段符合预期
            let visibleFlag = true;
            // 根据预期值判断是否有不符合预期的情况
            visibleFlag = allKeysValueExpected({
                value,
                name,
                formParamisArray: this.formParamisArray,
                formParams: this.formParams,
            });
            if (visibleFlag && required) {
                materialConfig.required = false;
                materialConfig.tempRequired = true;
            }
            return visibleFlag;
        };

        const submit = async () => {
            console.log('submit>>>>>>', formRef);
            const form = unref(formRef);
            if (!form) {
                return;
            }
            try {
                await form.validate();
                console.log('form.validate()>>>', form.validate());
            } catch (err) {
                console.log(err);
            }
        };

        //重置
        const resetFormParams = () => {
            const form = unref(formRef);
            console.log('重置', form);
            form.resetFields();
        };

        return {
            draw,
            submit,
            formRef,
            resetFormParams,
            formatFormConfigToMaterialConfigs,
            formatFormParams,
            ...toRefs(state),
        };
    },
});
</script>
