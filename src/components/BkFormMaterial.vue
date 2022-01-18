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
            <el-select v-model="formParams[name]"
                      >
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
    setup(props) {
        console.log('子组件formParams',props)
        // 重新将materialConfig的属性解构赋值，避免在模板中写太多重复字段
        const { name, type, extraFields, options } = props.materialConfig;
        const state = reactive({
            type: type, //组件类型
            name: name,
            materialConfig: props.materialConfig,
            formParams: props.formParams,
            getMergedObject: getMergedObject,
        });

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
