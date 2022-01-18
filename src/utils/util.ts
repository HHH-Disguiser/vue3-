
import { type } from "os";
import type { ElForm } from 'element-plus'

interface ArrayNumber {
    [index: number]: any
}

type urlParam = {
    [key: string]: any
}

/*
 * @description 获取地址栏参数
 */
export const getUrlParame = (paramName: string) => {
    const urlParams = {};
    const url = window.location.href;
    const idx = url.indexOf('?');
    if (idx === -1) {
        return false;
    }
    let params: ArrayNumber = url.substring(url.indexOf('?') + 1);
    params = params.split('#');
    params = params[0].split('&');
    params.forEach(item => {
        const param = item.split('=');
        urlParams[param[0]] = decodeURIComponent(param[1]);
    });
    if (paramName) {
        return urlParams[paramName];
    }
    return urlParams;
};

/**
 * 转化成连接参数
 * 
 */
export const toUrlParam = (param: urlParam) => {
    let base = param;
    if (typeof param === 'object') {
        base = '';
        Object.keys(param).forEach(key => {
            const item = param[key];
            if (Array.isArray(item)) {
                item.forEach(val => {
                    base += `&${key}[]=${val}`;
                });
            } else {
                base += `&${key}=${item}`;
            }
        });
        if (base) base = base.replace(/^&/, '');
    }

    return base;
};
/*
 * @description 获取地址栏hash参数
 */
export const getUrlHash = paramName => {
    const urlParams = {};
    const url = window.location.href;
    const idx = url.indexOf('#');
    if (idx === -1) {
        return false;
    }
    let params = url.substring(url.indexOf('#') + 1);
    params = params.split('&');
    params.forEach(item => {
        const param = item.split('=');
        urlParams[param[0]] = decodeURIComponent(param[1]);
    });
    if (paramName) {
        return urlParams[paramName];
    }
    return urlParams;
};

/**
 * 为extend属性，提供一个默认参数
 * @param {Object} extend  extend的参数
 * @param {object} defaults 设置默认参数
 */
export const getMergedObject = (extend, defaults) => {
    let current = defaults;
    if (extend && defaults) {
        Object.assign(current, extend);
    } else if (!defaults) {
        current = extend;
    }
    return current;
};
/**
 * 带单位的参数转化成数字或0
 * @param {String} str 
 */
export const toUnitNumber = str => {
    const reg = /[px|rem|em|pt]/g;
    const n = str.replace(reg, '') || 0;
    return Number(n);
};
/*
 * @description 密码正则
 */
export const passwordReg = () => (/^[a-zA-Z]{1}[a-zA-Z0-9@#$%&*?]{7,}$/gi);

/*
 * @description 手机正则
 */
export const mobileReg = () => (/^1[0-9]{10}$/g);

/*
 * @description 英文下划线字段转驼峰
 */
export const fieldSwitchReg = variable => variable.replace(/_+[a-zA-Z]/g,
    (str, index) => (index ? str.substr(-1).toUpperCase() : str));

// 判断对象是否为空
export const isEmptyObj = obj => (
    !obj || Object.keys(obj).length === 0
);

// 判断浏览器类型是否为IE
export const isIE = () => {
    const u = window.userAgent || navigator.userAgent;
    return u.indexOf('MSIE') > 0 || u.indexOf('Trident') > 0;
};

/**
 * 判断目标对象是否含有指定字段名
 * @param {Object} obj 目标对象
 * @param {String} field 字段名
 */
export const hasField = (obj, field) => {
    if (!obj || isEmptyObj(obj)) return false;
    const keyList = Object.keys(obj).map(key => key);
    return keyList.includes(field);
};

/*
 *  下载文件
 */
export const downloadFile = url => {
    const iframeEle = document.createElement('iframe');
    iframeEle.src = url;
    iframeEle.style.display = 'none';
    document.body.appendChild(iframeEle);
};

/**
 * 判断是否为日期
 * @param {*} date 要判断是否为日期的值
 */
export const isDate = date => {
    if (date === null || date === undefined) return false;
    if (Number.isNaN(new Date(date).getTime())) return false;
    if (Array.isArray(date)) return false; // deal with `new Date([ new Date() ]) -> new Date()`
    return true;
};

/**
 * 日期格式化
 * (new Date(), 'yyyy-mm-dd hh:ii:ss.S')==> 2006-07-02 08:09:04.423
 * (new Date(), 'yyyy-mm-dd E HH:ii:ss') ==> 2009-03-10 二 20:09:04
 * (new Date(), 'yyyy-mm-dd EE hh:ii:ss') ==> 2009-03-10 周二 08:09:04
 * (new Date(), 'yyyy-mm-dd EEE hh:ii:ss') ==> 2009-03-10 星期二 08:09:04
 * (new Date(), 'yyyy-m-d h:m:s.S') ==> 2006-7-2 8:9:4.18
 * (new Date(), 'yyyy/mm/dd hh:ii:ss.S') ==> 2017/04/17 10:00:48.282
*/
export const formatDate = (value, fmt) => {
    if (!value) {
        return null;
    }
    /* eslint-disable no-param-reassign */
    const date = new Date(value);
    /* eslint no-console: 'off' */
    if (date.toString() === 'Invalid Date') {
        console.log('日期不合法');
    }
    const o = {
        'M+': date.getMonth() + 1, // 月份,
        'm+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours() % 24 === 0 ? 0 : date.getHours() % 24, // 小时
        'H+': date.getHours(), // 小时
        'i+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    };
    const week = {
        0: '/u65e5',
        1: '/u4e00',
        2: '/u4e8c',
        3: '/u4e09',
        4: '/u56db',
        5: '/u4e94',
        6: '/u516d'
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (match, p1) => {
            if (p1.length > 1) {
                return (p1.length > 2 ? '/u661f/u671f' : '/u5468') + week[`${date.getDay()}`];
            }
            return week[`${date.getDay()}`];
        });
    }
    const keys = Object.keys(o);
    for (let k = 0, len = keys.length; k < len; k += 1) {
        const prop = keys[k];
        if (new RegExp(`(${prop})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
                ? (o[prop]) : ((`00${o[prop]}`).substr((`${o[prop]}`).length)));
        }
    }
    /* eslint-disable consistent-return */
    return fmt;
};

/**
 * elementUI日期格式化
 * (new Date(), 'yyyy-M-d H:m:s')==> 2006-7-2 8:9:4
 * (new Date(), 'yyyy-MM-dd HH:mm:ss') ==> 2009-07-02 08:09:04
 * (new Date(), 'h:mm:ss a') ==> 2009-03-10 8:09:04 pm
 * (new Date(), 'hh:mm:ss A') ==> 2009-03-10 08:09:04 PM
 * (new Date(), 'HH:mm:ss') ==> 20:09:04
 * (new Date(), 'timestamp') ==> 1236686944000
*/

/*
 * 判断数组是否含有目标值  eg: [[A,B],C]含有[A,B]   A和B可为任意类型
 * attention: 只从一维的角度去判断，引用类型的前后顺序要一致
 * @param {Array} 目标数组
 * @param {String || Array || Object} 目标值
 */
export const judgeArrayIncludeTargetValue = (arr, target) => {
    if (!Array.isArray(arr) || !target) return;
    const strArr = arr.map(item => JSON.stringify(item));
    return strArr.includes(JSON.stringify(target));
};

/*
 * 根据name判断对应的元组件type类型
 * @param {String} name 判断的依据name
 * @param {Array} materialConfigs 整个页面的一维formConfig表单组配置
 */
export const nameMatchType = (name, materialConfigs) => {
    const obj = materialConfigs.find(item => item.name === name);
    return obj.type;
};

/**
 * 判断依赖的单一字段值是否在期望值中, 若不在则改变标记对象的值
 * @param {Object} obj 参数集合对象
 * @param {String || Array} obj.value 期望值
 * @param {String} obj.name 依赖的字段名
 * @param {Boolean} obj.formParamisArray 依赖的字段名对应的字段值是否为数组类型
 * @param {Object} obj.formParams 表单值对象
 * @param {Object} obj.obj 标记对象
 */
export const singleKeysValueExpected = ({
    value, name, formParamisArray, formParams, obj
}) => {
    if (formParamisArray) {
        // 判断期望值是一维数组还是二维数组
        if (Array.isArray(value[0])) {
            if (!judgeArrayIncludeTargetValue(value, formParams[name])) {
                obj.flag = false;
            }
        } else if (JSON.stringify(value) !== JSON.stringify(formParams[name])) {
            obj.flag = false;
        }
    } else if (!value.includes(formParams[name])) {
        obj.flag = false;
    }
};

/**
 * 判断依赖的所有字段值是否符合期望
 * @param {Object} obj 参数集合对象
 * @param {String || Array} obj.value 期望值
 * @param {String} obj.name 依赖的所有字段名
 * @param {Boolean} obj.formParamisArray 依赖的字段名对应的字段值是否为数组类型
 * @param {Object} obj.formParams 表单值对象
 */
export const allKeysValueExpected = ({
    value, name, formParamisArray, formParams
}) => {
    // 默认符合期望
    const obj = { flag: true };
    if (Array.isArray(name)) {
        name.forEach((key, i) => {
            if (Array.isArray(value[i])) {
                singleKeysValueExpected({
                    value: value[i],
                    name: key,
                    formParamisArray: formParamisArray(key),
                    formParams,
                    obj
                });
            } else if (formParams[key] !== value[i]) {
                obj.flag = false;
            }
        });
    } else if (Array.isArray(value)) {
        singleKeysValueExpected({
            value,
            name,
            formParamisArray: formParamisArray(name),
            formParams,
            obj
        });
    } else {
        obj.flag = formParams[name] === value;
    }
    return obj.flag;
};
/**
 * 对象深度拷贝
 * @param {Object} obj 拷贝对象
 */
export const deepCopy = obj => (function deepcopy(oldObj) {
    // 定义一个新的空对象
    let newObject = {};
    // 判断原对象是否存在
    if (oldObj) {
        // 判断原对象的类型
        if (oldObj.constructor === Object) {
            newObject = new oldObj.constructor();
        } else {
            newObject = new oldObj.constructor(oldObj.valueOf());
        }
        // 遍历克隆原对象的属性
        Object.keys(oldObj).forEach(key => {
            if (newObject[key] !== oldObj[key]) {
                if (typeof (oldObj[key]) === 'object') {
                    // 对象内部的子对象
                    newObject[key] = deepcopy(oldObj[key]);
                } else {
                    newObject[key] = oldObj[key];
                }
            }
        });
        return newObject;
    }
}(obj));

/**
 * 判断字符串是否是标签格式
 * @param {String} str 要判断的字符串
 */
export const stringIsHTML = str => {
    if (!str || typeof str !== 'string') return;
    const reg = /<("[^"]*"|'[^']*'|[^'">])*>/;
    return reg.test(str);
};

/**
 * 防抖函数
 * @param {Function} fn 处理函数
 * @param {Number} delay 延时时间
 */
export const debounce = (fn, delay) => {
    let timer = null;
    return (...args) => {
        const self = this;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(self, args);
        }, delay);
    };
};

/**
 * 将url转换为对象形式
 * @param {String} url 链接地址
 */
export const urlObject = url => {
    const urlArr = url && url.split('/');
    const urlLen = urlArr.length - 1;
    const urlObj = {
        host: urlArr[2],
        hostname: urlArr[2].split(':')[0],
        origin: `${urlArr[0]}//${urlArr[2]}`,
        pathname: '',
        port: urlArr[2].split(':')[1],
        protocol: urlArr[0].split(':')[0],
        search: `?${urlArr[urlLen].split('?')[1]}`
    };

    urlArr.forEach((item, index) => {
        if (index > 2 && index < urlLen) {
            urlObj.pathname += `/${item}`;
        } else if (index === urlLen) {
            urlObj.pathname += `/${item.split('?')[0]}`;
        }
    });
    return urlObj;
};


export const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!')
            return false
        }
    })
}

export const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
    if (!formEl) return
    console.log('formEl',formEl)
    formEl.resetFields()
}