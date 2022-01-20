/*
* @Author: xiaoyu
* @Date: 2019-07-03
* @Description: 递归表头组件，支持列表内表头无限分层次展示
*/
<template>
    <el-table-column v-if="data.visible !== false"
                     :key="data.name"
                     :prop="data.name"
                     v-bind="getMergedObject(data.extend, {label:data.label,width:data.width})"
                     show-overflow-tooltip>
        <template v-if="Array.isArray(data.data)">
            <template v-for="item in data.data">
                <recursive-title :data="item" />
            </template>
        </template>
    </el-table-column>
</template>

<script>
import { getMergedObject } from '../utils/util';

export default {
    name: 'RecursiveTitle',
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        getMergedObject
    }
};
</script>
