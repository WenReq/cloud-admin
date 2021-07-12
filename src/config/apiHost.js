const env = process.env.NODE_ENV || 'development'
const _dev = 'http://10.168.1.81:9095'
const _pro = 'https://cloud.mymrmao.com'
const baseURL = `${env === 'production' ? _pro : _dev}/cloudApi`

export default {
  // 上传图片地址
  uploadImgHost: baseURL,
  // 上传excel
  uploadExcelHost: baseURL
}
