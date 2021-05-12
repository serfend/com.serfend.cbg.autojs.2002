evalJs('config', () => {
  toast(global.config.versionInfo)
  evalJs('utils', () => {
    evalJs('devServer', () => {
      evalJs('tcp', () => {
        console.log('tcp load', global.devServer)
        global.devServer.info('init client script')
        global.init.initCallBack()
      }, null)
    }, null)
  }, null)
})