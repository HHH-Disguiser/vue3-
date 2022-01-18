<template>
    <div>
        <BkList :searchConfig="searchConfig">
            <template v-slot:tips> </template>
        </BkList>
    </div>
</template>

<script lang="ts">
import BkList from '@/components/BrList.vue';
import { onMounted, reactive, toRefs } from 'vue';

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
            gameList: [
                {
                    name_N: '王者',
                    idD: 'a1_A',
                },
                {
                    name_N: '吃鸡',
                    idD: 'a2B',
                },
            ],
        });
        function apiListProxy(target: any) {
            return new Proxy(target, {
                set: function (item, property, value, itemProxy) {
                   return item[property] = '123';
                },
            });
        }

        state.gameList.map(apiListProxy);
        console.log('state.gameList', state.gameList);
        return {
            ...toRefs(state),
        };
    },
};
</script>
