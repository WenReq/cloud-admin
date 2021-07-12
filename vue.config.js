const Webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, dir)
}

function addStyleResource (rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [path.resolve(__dirname, 'src/assets/css/global.styl')]
    })
}

module.exports = {
  publicPath: isProduction ? '/' : './',
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type =>
      addStyleResource(config.module.rule('stylus').oneOf(type))
    )
    config.resolve.alias
      .set('static', resolve('static'))
      .set('@', resolve('src'))
      .set('EZUIKit', resolve('static/ezuikit.js'))
  },
  configureWebpack: config => {
    config.plugins.push(
      new Webpack.ProvidePlugin({
        EZUIKit: 'EZUIKit',
        'windows.EZUIKit': 'EZUIKit'
      })
    )
    if (isProduction) {
      const optimization = {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: false,
                pure_funcs: ['console.log'] // 移除console
              }
            }
          })
        ]
      }
      const productionGzipExtensions = ['html', 'js', 'css']

      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 100, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      )

      Object.assign(config, {
        optimization
      })
    }
  }
}
