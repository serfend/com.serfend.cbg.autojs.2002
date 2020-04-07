console.show()

var lastRunOperation = new Date()
var host = 'http://39.97.229.104'
var fileLoad = '/file/load'
var fileDownLoad = '/file/download'
var appName = 'auto.cbg'
var header = {
  'User-Agent': 'autojs ' + app.autojs.versionName + ' cbgClient' 
}
var NetException = (status, msg) => {
  this.message = msg
  this.status = status
}
var loadHttpContent = (filename, cb, filepath) => {
  filepath = !filepath ? appName : filepath
  var debugInfo = 'httpContent:' + filename
  if (global.devServer)
    global.devServer.debug(debugInfo)
  else
    console.log(debugInfo)
  var url = host + fileLoad + "?filepath=" + filepath + "&filename=" + filename
  http.get(url, {
    headers: header
  }, (data, err) => {
    if (err) {
      console.err(err)
      cb(new NetException(data.statusCode, err))
      return
    }
    var fileInfo = data.body.json()
    // console.log(fileInfo)
    if (fileInfo.status && fileInfo.status !== 0) {
      console.error('httpContentFail[' + filename + ']:' + fileInfo.message)
      return
    }
    var url2 = host + fileDownLoad + "?fileid=" + fileInfo.data.file.id
    http.get(url2, {
      headers: header
    }, (d, e) => {
      if (e) {
        console.err(err)
        cb(new NetException(d.statusCode, e))
        return
      }
      cb(d.body)
    })
  })
}
var requestPromise = function (fileName, filePath) {
  var pr = this
  var catchCallBack = function () { toast('no catch') }
  var thenCallBack = function () { toast('no then') }
  this.catch = function (cb) {
    catchCallBack = function (err) {
      cb(err)
      return pr
    }
  }
  this.then = function (cb) {
    thenCallBack = function (data) {
      cb(data)
      return pr
    }
  }
  loadHttpContent(fileName, function (data) {
    if (data.status && data.status !== 0) {
      return catchCallBack(data)
    } else {
      return thenCallBack(data)
    }
  }, filePath)
}

// 临时存储加载的方法
var self = {

}

var global = {
  foo: (a, b) => {
    console.log('is call')
    return a + b
  }
}


function jsFileExecInner(filename, cb, ext, execModelCallBack, filePath) {
  if (!ext) ext = 'js'
  lastRunOperation = new Date()
  return new requestPromise(filename + '.' + ext).then((data) => {
    global[filename] = {}
    global[filename].initCallBack = () => {
      if (cb) {
        var debugInfo = filename + '.callback is call'
        if (global.devServer)
          global.devServer.debug(debugInfo)
        else
          console.log(debugInfo)
        cb()
      } else {
        var debugInfo = filename + '.callback is null'
        if (global.devServer)
          global.devServer.warn(debugInfo)
        else
          console.warn(debugInfo)
      }
    }
    execModelCallBack(data.string())
  }, filePath)
}

/**
 * 使用js运行
 *
 * @param {*} filename
 * @param {*} cb
 * @param {*} ext
 * @returns
 */
function evalJs(filename, cb, ext, filePath) {
  return jsFileExecInner(filename, cb, ext, (data) => { eval(data), filePath })
}

/**
 * 使用脚本引擎运行，通常用来运行ui
 *
 * @param {*} filename
 * @param {*} cb
 * @param {*} ext
 * @returns
 */
function execJs(filename, cb, ext, filePath) {
  return jsFileExecInner(filename, cb, ext, (data) => { engines.execScript(filename, data) }, filePath)
}

evalJs('main')

while (true) {
  var isEnd = false
  sleep(1500)
  if (lastRunOperation == -1) {
    global.devServer.warn('clientStop')
    toast('用户主动停止')
    isEnd = true
  }
  else {
    var interval = new Date() - lastRunOperation
    if (interval > 120000) {
      isEnd = true
      toast('超过' + interval + 'ms无反应，结束')
    }
  }
  if (isEnd) {
    threads.shutDownAll()
    console.hide()
    exit()
    break
  }
}
