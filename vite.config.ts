import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const path = require('path');

function resolveAlias(dir) {
  return path.resolve(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolveAlias('src'),
      '@components': resolveAlias('src/components'),
      '@utils': resolveAlias('src/utils'),
    }
  },
  base: './',  //设置打包路径
  server: {
    port: 4000,   //设置服务启动端口号
    open: true,   //设置服务启动时是否自动打开浏览器
    cors: true,   //允许跨域
    host: '0.0.0.0'
  }
})
