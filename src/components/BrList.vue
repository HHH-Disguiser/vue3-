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

            <!-- 功能按妞区域 -->
            <div v-if="buttonConfig && Array.isArray(buttonConfig.data)"
                 :class="['btn-wrapper',
                              buttonConfig.direction ? `btn-wrapper-${buttonConfig.direction}` : 'btn-wrapper-right']">
                <div v-for="(item, i) in buttonConfig.data">
                    <BkButton :key="item.name || i"
                              :dialogConfig="dialogConfig"
                              :dialogVisible="dialogVisible"
                              v-bind="item" />
                </div>
            </div>
        </section>
        <section>
            <!-- 表格区域 -->
            <div ref="table"
                 class="table-wrapper">
                <el-table ref="list"
                          :data="tableData">
                    <template v-if="Array.isArray(tableConfig.data)">
                        <template v-for="item in tableConfig.data">
                            <!-- 这里只暂时处理默认状态 -->
                            <RecursiveTitle :data="item" />
                        </template>
                    </template>
                </el-table>
            </div>
            <!-- 分页区域 -->
            <div ref="pagination"
                 v-if="tableConfig.http && tableConfig.http"
                 class="pagination-wrapper">
                <el-pagination background
                               layout="prev, pager, next"
                               :total="1000">
                </el-pagination>

            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { reactive, ref, watchEffect, toRefs, nextTick } from 'vue';
import MyBkForm from './BkForm.vue';
import BkButton from './Button.vue';
import RecursiveTitle from './RecursiveTitle.vue';
import { ElButton, ElTable, ElPagination } from 'element-plus';
import { getMergedObject } from '../utils/util';
export default {
    name: 'BkList',
    components: {
        MyBkForm,
        ElButton,
        ElTable,
        RecursiveTitle,
        ElPagination,
        BkButton,
    },
    props: {
        //搜索查询参数配置
        searchConfig: {
            type: Object,
            default: () => ({}),
        },
        // 表格配置
        tableConfig: {
            type: Object,
            required: true,
            default: () => ({}),
        },
        //弹窗配置
        dialogConfig: {
            type: Object,
            default: () => ({}),
        },
        buttonConfig: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props) {
        /**
         * reactive  响应式  proxy  针对对象
         * */
        const { tableConfig } = props;
        console.log('tableConfig>>', props.buttonConfig);
        const listDataProps = Object.assign({
            // 对应字段
            data: 'data',
            pageNumber: 'pageNumber',
            pageSize: 'pageSize',
            results: 'results',
            message: 'message',
            totalCount: 'totalCount',
            // 游标分页
            cursorCode: 'cursorCode',
        });
        const state = reactive({
            isHasChildren: false,
            searchVisible: '', //筛选项隐藏
            getMergedObject: getMergedObject,
            searchConfig: props.searchConfig,
            searchParams: {}, //当前搜索参数集合
            listDataProps,
            tableConfig, //表格数据
            tableData: tableConfig.data,
            buttonConfig: props.buttonConfig,
            dialogConfig: props.dialogConfig,
            // 分页数据
            paginationSetting: {
                [listDataProps.pageNumber]: 1, // 当前页
                [listDataProps.pageSize]: (tableConfig && tableConfig.size) || 20, // 每页长度
            },
            totalCount: 0, // 总数

            dialogVisible: {}, // dialog显示隐藏集合
        });

        const formRefs = ref<any>(null);

        //TODO  这里会有一个疑问  reactive  ref 都可以放数据 他们有什么不同呢
        /**
         * ref 将一个原始数据类型转换成一个带有响应式特性，针对原始数据类型
         * */
        const draw = ref(true);

        // 重置
        const handleClear = async () => {
            formRefs.value.resetFormParams();
            state.searchParams = formRefs.value.formatFormParams();
            await nextTick();
            getTableData();
        };

        //查询  formRefs.value获取子组件中的属性 && 方法
        const handleSearch = () => {
            console.log('formRefs>>>>', formRefs.value, formRefs.value.formParams);
            state.searchParams = formRefs.value.formatFormParams();
            console.log(' state.searchParams', state.searchParams);
            getTableData();
        };

        //展开
        const handleSearchVisible = () => {};

        watchEffect(() => {
            console.log('buttonConfig==list', state.buttonConfig);
        });

        /**
         * 获取列表数据
         */
        const getTableData = () => {
            const { tableConfig } = state;
            if (!tableConfig.http || !tableConfig.http.url) return;
            const { url, method, onSuccess, onFaild } = tableConfig.http;
            const { data, results, totalCount } = listDataProps;
        };

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
<style scope lang='scss'>
@import './index.scss';
</style>