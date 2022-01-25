<template>
    <div>
        <BkList :searchConfig="searchConfig"
                :tableConfig="tableConfig"
                :buttonConfig="buttonConfig"
                :dialogConfig="dialogConfig">
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
                        visible: true,
                    },
                    {
                        name: 'field2',
                        label: '字段2',
                        visible: true,
                    },
                    {
                        name: 'field3',
                        label: '字段3',
                        visible: true,
                    },
                ],
            },
            buttonConfig: {
                data: [
                    {
                        name: 'button2',
                        label: '点击出现弹窗',
                        scene: 'dialog',
                        target: 'dialog1',
                        selection: false,
                    },
                ],
            },
            dialogConfig: {
                data: [
                    {
                        name: 'dialog1',
                        // 当前对话框请求配置
                        http: {
                            url: '/api/form/submit',
                            method: 'post',
                            // 成功钩子(服务器返回，当对话框集实例)
                            onSuccess: (res: any, dialog: any) => {
                                // 提示
                                console.log('res>>>>>', res);
                                // 关闭对话框
                                dialog.dialogVisible.dialog1 = false;
                            },
                        },
                        data: [
                            {
                                name: 'dialog-form',
                                type: 'form',
                                formConfig: {
                                    data: [
                                        {
                                            data: [
                                                {
                                                    name: 'name',
                                                    label: '姓名',
                                                    type: 'input',
                                                    placeholder: '请选择',
                                                    button: {
                                                        label: '选择',
                                                        target: 'chooseName',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        name: 'chooseName',
                        extend: {
                            title: '选择姓名',
                            width: '1200px',
                        },
                        data: [
                            {
                                name: 'name',
                                type: 'list',
                                tableConfig: {
                                    http: {
                                        url: '/api/radio-list',
                                        method: 'get',
                                    },
                                    selection: false,
                                    radio: true,
                                    extend: {
                                        'reserve-selection': false,
                                    },
                                    data: [
                                        {
                                            name: 'name',
                                            label: '姓名',
                                        },
                                    ],
                                },
                            },
                        ],
                        confirmButtonConfig: {
                            label: '确认',
                            callback: (that: any) => {
                                // const chosen = that.$refs.name[0].tableSelection[0];
                                // this.dialogConfig.data[0].data[0].formConfig.results = chosen;
                                that.dialogVisible.chooseName = false;
                            },
                        },
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
