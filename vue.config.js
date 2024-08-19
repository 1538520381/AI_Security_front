const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭语法检查
  lintOnSave: false,
  // 开启代理服务器
  // devServer: {
  //   host: "www.fedlearnwithad.com",
  //   proxy: {
  //     '/guo': {
  //       target: 'http://192.168.43.34:8000',
  //       pathRewrite: {'^/guo': ''}, // 将/api开头的请求地址重写
  //       changeOrigin: true,
  //       ws: true,
  //     },
  //     '/wjx': {
  //       target: 'https://aip.baidubce.com',
  //       pathRewrite: {'^/wjx': ''},
  //       ws: true,
  //       changeOrigin: true
  //     },
  //   }
  // }
  devServer: {
    // host: "0.0.0.0", // 将host修改为localhost
    // public: "192.168.93.40",
    proxy: {
      '/guo': {
        target: 'http://localhost:8000', // 将target修改为你的本地服务器地址
        pathRewrite: { '^/guo': '' }, // 将/api开头的请求地址重写
        changeOrigin: true,
        ws: true,
      },
      '/wjx': {
        target: 'http://localhost:8000', // 将target修改为你的本地服务器地址
        pathRewrite: { '^/wjx': '' },
        ws: true,
        changeOrigin: true
      },
      '/serverRequest': {
        target: 'http://172.20.10.9:9000', // 将target修改为你的本地服务器地址
        pathRewrite: { '^/serverRequest': '' },
        ws: true,
        changeOrigin: true
      },
      '/localRequest': {
        target: 'http://172.20.10.9:8000', // 将target修改为你的本地服务器地址
        pathRewrite: { '^/localRequest': '' },
        ws: true,
        changeOrigin: true
      },
    }
  }
})
