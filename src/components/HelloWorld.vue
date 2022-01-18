<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <button @click="increment">
            count: {{ state.count }} , three {{ three }} , refNum: {{ refNum }} name:{{ name }}
        </button>
        <button @click="gotoHome">home</button>
    </div>
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
import { useRouter } from 'vue-router';
export default {
    name: 'HelloWorld',
    props: {
        msg: String,
    },
    //  相当于beforeCreate 和 created  也就是初始化都在这了
    setup(props, ctx) {
        // ctx 类似于当前组件的实例
        console.log('子组件', props.msg, ctx);
        const router = useRouter();
        const state = reactive({
            count: 0,
            double: computed(() => state.count * 2),
        });

        // computed  也可以单独拿出来使用
        const three = computed(() => state.count * 3);

        //ref  接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property .value
        const refNum = ref();

        // 立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。   watchEffect
        watchEffect(() => {
            refNum.value = state.count;
            console.log('watchEffect', state);
        });

        //watch
        watch(refNum, (a, b) => {
            console.log(a, b, 'watch,a,b');
        });

        //也可以在setUp 定义函数,在函数里不用写this

        function increment() {
            state.count++;
        }

        function gotoHome() {
            router.push({ path: '/home' });
        }

        onUpdated(() => {
            console.log('onUpdated');
        });

        onUnmounted(() => {
            console.log('onUnmounted');
        });

        onBeforeUnmount(() => {
            console.log('onBeforeUnmount');
        });

        onBeforeUpdate(() => {
            console.log('onBeforeUpdate');
        });

        onMounted(() => {
            console.log('onMounted');
        });

        onBeforeMount(() => {
            console.log('onBeforeMount');
        });

        console.log('setUp');

        const obj = { age: 12 };

        const toR = toRef(obj, 'toR');
        console.log('toR', toR);

        const stateaa = reactive({
            num: 1,
            name: 'baby张',
        });

        return {
            three,
            refNum,
            increment,
            gotoHome,
            state,
            ...toRefs(stateaa),
        };
    },
    methods: {
        /**
         * 转换数据成服务器接收的格式
         */
        formatFormParams() {
            const params = {};

            return params;
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
