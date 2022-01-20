<template>
    <div>
        <BkList :searchConfig="searchConfig"
                :tableConfig="tableConfig">
            <template v-slot:tips> </template>
        </BkList>
    </div>
</template>

<script lang="ts">
import BkList from '@/components/BrList.vue';
import { reactive, toRefs } from 'vue';

export default {
    name: 'Home',
    components: {
        BkList,
    },
    setup() {
        const state = reactive({
            searchConfig: {
                title: '列表页面组件',
                layout: 'flow',
                extend: {
                    title: '表单填写',
                    top: '50px',
                },
                data: [
                    {
                        data: [
                            {
                                name: 'inputDemo',
                                type: 'input',
                                label: '普通输入框',
                            },
                            {
                                name: 'passwordDemo',
                                type: 'password',
                                label: '密码输入框',
                            },
                            {
                                name: 'selectDemo',
                                type: 'select',
                                label: '选择框',
                                options: [
                                    {
                                        value: '1',
                                        label: '足球',
                                    },
                                    {
                                        value: '2',
                                        label: '篮球',
                                    },
                                ],
                            },
                            {
                                name: 'dateDemo',
                                type: 'datetimerange',
                                label: '日期选择区间',
                            },
                        ],
                    },
                ],
            },
            tableConfig: {
                http: {
                    url: '/api/page-list',
                },
                data: [
                    {
                        name: 'field1',
                        label: '字段1',
                        visible:true,
                    },
                    {
                        name: 'field2',
                        label: '字段2',
                        visible:true,
                    },
                    {
                        name: 'field3',
                        label: '字段3',
                        visible:true,
                    },
                ],
            },
        });
        return {
            ...toRefs(state),
        };
    },
};
</script>
