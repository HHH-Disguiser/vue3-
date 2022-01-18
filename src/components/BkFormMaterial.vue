<template>
    <!-- :props 的值没绑定对-->
    <el-form-item :label="materialConfig.label"
                  :props="name">
        <!-- 输入框 -->
        <div v-if="type === 'input' || type === 'password'">
            <el-input v-model="formParams[name]"
                      :show-password="type === 'password'" />
        </div>

        <!-- select 下拉框 -->
        <template v-else-if="type === 'select'">
            <el-select v-model="formParams[name]">
                <el-option v-for="options in materialConfig.options"
                           :key="options.value"
                           :label="setMaterialOptionsLabelByConfig(options, 'label')"
                           :value="setMaterialOptionsLabelByConfig(options, 'value')" />
            </el-select>
        </template>

        <!-- 日期/时间区间选择器 -->
        <template v-else-if="
                        type === 'daterange' || type === 'datetimerange' || type === 'monthrange'
                    ">
            <el-date-picker v-model="formParams[name]"
                            :range-separator="materialConfig.separator || '-'" />
        </template>

    </el-form-item>
</template>

<script>
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
} from 'vue';
import { ElInput, ElSelect, ElOption } from 'element-plus';
import { getMergedObject } from '../utils/util';
export default {
    name: 'BkFormMaterial',
    props: {
        materialConfig: {
            type: Object,
            required: true,
        },
        // 是当前表单的name字段值集合
        formParams: {
            type: Object,
            required: true,
        },
    },
    components: { ElInput, ElSelect, ElOption },
    setup(props, ctx) {
        console.log('子组件formParams', props, 'this', ctx);
        const { name, type, extraFields, options, http } = props.materialConfig;
        const state = reactive({
            materialParam: props.formParams[name],
            name: name, // 组件唯一标识
            type: type, // 组件类型
            extraFields: extraFields, // 额外自定义字段
            materialConfig: props.materialConfig,
            formParams: props.formParams,
            getMergedObject: getMergedObject,
            optionsLabelList: [], // 从options里找到value对应的label组成的数组
            materialOptionsLabel: '', // 从options里找到value对应的label，用于只读时显示
            // 需要初始化options字段的type类型
            optionsTypeList: ['select', 'search', 'autocomplete', 'checkbox', 'radio', 'cascader', 'transfer'],
            typeArrayList: ['cascader', 'checkbox', 'transfer', 'areaselect', 'listselect', 'tag'], // 数据类型为数组的列表
        });

        onBeforeUnmount(() => {
            initConfig();
        });

        /**
         * 初始化配置
         * @param {Object} materialConfigF  元组件配置
         */
        const initConfig = () => {
            const { materialConfig, formParams } = props;
            const { http, type, name, disabled, depend } = materialConfig;
            const nullValue = this.typeArrayList.includes(type) ? [] : '';
            let value = materialConfig.value !== undefined ? materialConfig.value : nullValue;
            value =
                formParams[name] !== undefined && formParams[name] !== null && formParams[name] !== ''
                    ? formParams[name]
                    : value;

            // 添加value监控值  作用就是为了给formParams赋值
            // TODO vue3里面怎么去深层改数据
            if (name) {
                //formParams[name] = value;
                Reflect.set(formParams, name, value);
            }

            if (!http || !http.url) return;

            // TODO v1.0版本暂时不处理select 下拉框自带默认值的情况
        };

        /**
         * @Description 根据配置的属性获取数据对象的值
         * @params [Object] obj 数据对象
         * @params [String] key 配置的属性值
         */
        function setMaterialOptionsLabelByConfig(obj, key) {
            const { PROPS, valueObj, extend } = props.materialConfig;
            // 给value赋值一个对象
            if (key === 'value' && valueObj) {
                return obj;
            }
            if (PROPS && PROPS[key]) {
                return obj[PROPS[key]];
            }
            if (key === 'key') {
                if (extend && extend['value-key']) {
                    return obj[extend['value-key']];
                }
                if (PROPS && PROPS.value) {
                    return obj[PROPS.value];
                }
            }
            return obj[key];
        }

        return {
            setMaterialOptionsLabelByConfig,
            ...toRefs(state),
        };
    },
};
</script>
