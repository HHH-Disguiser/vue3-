<template>
    <div :class="[`${isHasChildren ? 'list-tree' : ''}`, 'list-wrapper']">
        <!-- 提醒插槽区域 -->
        <slot name="tips" />
        <div v-if="searchConfig.title"
             class="title-wrapper">
            {{ searchConfig.title }}
        </div>
        <section v-if="draw">
            <!-- 表单组件 -->
            <MyBkForm ref="formRefs"
                      :form-config="getMergedObject(searchConfig, {
                                 layout: 'grid-noborder',
                             })">
                <!-- 查询/清空框 -->
                <template v-slot:search
                          v-if="Array.isArray(searchConfig.data) && searchConfig.data.length">
                    <div class="search-btn-wrapper">
                        <el-button v-if="isSearchButtonVisible"
                                   @click="handleSearchVisible"
                                   :icon="searchVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                                   size="small">
                            {{ searchVisible ? "收起" : "展开" }}
                        </el-button>
                        <el-button @click="handleClear()"
                                   v-if="searchConfig.needReset || true"
                                   size="small">
                            重置
                        </el-button>
                        <el-button @click="handleSearch()"
                                   type="primary"
                                   size="small">
                            查询
                        </el-button>
                    </div>
                </template>
            </MyBkForm>
        </section>
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
} from 'vue';
import MyBkForm from './BkForm.vue';
import { ElButton } from 'element-plus';
import { getMergedObject } from '../utils/util';
export default {
    name: 'BkList',
    components: {
        MyBkForm,
        ElButton,
    },
    props: {
        //搜索查询参数配置
        searchConfig: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props) {
        /**
         * reactive  响应式  proxy  针对对象
         * */
        const state = reactive({
            isHasChildren: false,
            searchVisible: '', //筛选项隐藏
            getMergedObject: getMergedObject,
            searchConfig: props.searchConfig,
            searchParams: {}, //当前搜索参数集合
        });

        const formRefs = ref<any>(null);

        //TODO  这里会有一个疑问  reactive  ref 都可以放数据 他们有什么不同呢
        /**
         * ref 将一个原始数据类型转换成一个带有响应式特性，针对原始数据类型
         * */
        const draw = ref(true);

        // 重置
        const handleClear = () => {
            formRefs.value.resetFormParams();
            state.searchParams = formRefs.value.formatFormParams();
            // 请求接口
        };

        //查询  formRefs.value获取子组件中的属性 && 方法
        const handleSearch = () => {
            console.log('formRefs>>>>', formRefs.value, formRefs.value.formParams);
            state.searchParams = formRefs.value.formatFormParams();
            console.log(' state.searchParams', state.searchParams,);
            // 请求接口
        };

        //展开
        const handleSearchVisible = () => {};

        watchEffect(() => {
            console.log('watchEffect==list', props.searchConfig);
        });

        return {
            draw,
            handleClear,
            handleSearch,
            handleSearchVisible,
            formRefs,
            // toRefs() 把响应式对象转换成普通对象，里面的属性还是响应式属性
            ...toRefs(state),
        };
    },
};
</script>
