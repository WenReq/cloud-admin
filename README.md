## 云平台项目文档

### 核心技术栈
[Vue 2.x](https://cn.vuejs.org/)
[Ant Design of Vue](https://www.antdv.com/docs/vue/introduce-cn/)

### 网址/账号
*[Jenkins 打包](http://10.168.1.11:8080/)*
+ 生产环境----账号：mspro 密码：账号：mspro 项目名称：prod-cloud-web
+ 生产环境----账号：mstest 密码：账号：mstest 项目名称：docker-cloud-web-pipeline

*生产/测试地址*
+ [测试环境](http://10.168.1.80:8005/) 账号：sysadmin 密码：123456
+ [生产环境](http://cloud.mymrmao.com/) 账号：jsmadmin 密码：123456

### 项目结构说明
```
├── Dockerfile ---------------------------- docker配置文件
├── Jenkinsfile --------------------------- jenkins打包配置
├── cloud.conf ---------------------------- nginx配置文件
├── public
│   ├── browser_error.html ---------------- 低版浏览器访问的文件
│   └── index.html ------------------------ 主要入口文件
├── src
│   ├── App.vue
│   ├── api
│   │   └── request ------------------------ axios二次封装
│   ├── assets ----------------------------- 静态资源
│   ├── components ------------------------- 公共组件
│   ├── config ----------------------------- 上传图片等地址配置
│   ├── core
│   │   ├── bootstrap.js ------------------- vuex初始化赋值
│   │   ├── directives --------------------- 自定义指令
│   │   └── use.js ------------------------- 项目初始化依赖
│   ├── main.js
│   ├── permission.js ---------------------- 动态创建路由
│   ├── plugins ---------------------------- 插件配置
│   ├── router ----------------------------- 页面路由
│   ├── store ------------------------------ vuex
│   ├── utils ------------------------------ 公共方法
│   └── views ------------------------------ 页面
└── vue.config.js
```

