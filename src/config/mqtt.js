const env = process.env.NODE_ENV || 'development'

const MQTT_USERNAME = 'maosir'

let MQTT_SERVICE = 'ws://10.168.1.105:8083/mqtt'
let MQTT_PASSWORD = '1qaz2wsx'

if (env === 'production') {
  // 生产环境地址
  // MQTT_SERVICE = 'ws://47.98.243.24:8083/mqtt'
  MQTT_SERVICE = 'wss://api.mymrmao.com:/mqtt'
  MQTT_PASSWORD = '1234@qwer'
} else {
  // 测试
  MQTT_SERVICE = 'ws://10.168.1.86:8083/mqtt'
  MQTT_PASSWORD = '1qaz2wsx'
}

export { MQTT_SERVICE, MQTT_PASSWORD, MQTT_USERNAME }
