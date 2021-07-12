const env = process.env.NODE_ENV || 'development'
const _dev = 'http://10.168.1.83:9093'
const _pro = 'http://boss.mymrmao.com'
const baseURL = `${env === 'production' ? _pro : _dev}/bossApi`

export default {
  // 我要体验地址
  experienceHost: baseURL
}
