node {
    stage('拉取代码') {
      git branch: '${Branch}', credentialsId: '0e13969d-0856-40c0-999c-0c6913133e51', url: 'http://10.168.1.101:701/web/cloudadmin.git'
    }
    stage('初始化'){
      nodejs('node_V10.16.3') {
        sh 'node -v'
        sh 'yarn -v'
        sh 'yarn install'
      }
    }
    stage('打包') {
      nodejs('node_V10.16.3') {
        sh 'yarn test'
      }
    }
    stage('镜像构建'){
      docker.build("10.168.1.84:5000/cloud-web:${Tag}").push()
    }
    stage('创建或升级服务和应用'){
      CONTAINER_STATE = sh(  returnStdout: true, script: ' /usr/local/rancher-v0.6.13/rancher ps | grep cloud-web | wc -l')
      CONTAINER_STATE = CONTAINER_STATE.trim()
      if (CONTAINER_STATE == '0') {
        echo '创建服务和应用'
        sh '''
        /usr/local/rancher-v0.6.13/rancher up -p -s web -d;
        /usr/local/rancher-v0.6.13/rancher run -l 'io.rancher.container.pull_image=always' -l io.rancher.scheduler.affinity:host_label='web=cloud' -p 8005:8005 --net host --name web/cloud-web 10.168.1.84:5000/cloud-web:${Tag}
        '''
        }else{
          echo '升级服务和应用'
          rancher confirm:true, credentialsId:'3212', endpoint: 'http://10.168.1.80:8080/v2-beta', environmentId:'1a5', image: '10.168.1.84:5000/cloud-web:${Tag}', ports: '', service: 'web/cloud-web', timeout: 50
        }
    }
}
