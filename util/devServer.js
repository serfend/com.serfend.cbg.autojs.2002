
self.devServer = function () {
  this.selfConfig = {
    start: global.utils.parseTime(new Date()),
    clientName: global.config.clientName
  }
  this.host = global.config.apiHost + '/log/report'
  this.sendingQueue = []
  this.report = function (msg, rank, username) {
    this.sendingQueue.push({
      msg: msg,
      rank: rank,
      username: username
    })
  }
  var reporter = this
  this.infoCode = {
    disaster: 0,
    error: 4,
    warn: 8,
    info: 16,
    debug: 32
  }
  for (var itemFunction in this.infoCode) {
    this[itemFunction] = function (msg, username) {
      return this.report(msg, this.infoCode[itemFunction], username)
    }
  }
  this.error = function (msg, username) {
    return this.report(msg, this.infoCode.error, username)
  }
  this.report(JSON.stringify(this.selfConfig), 16, global.config.appName)
  this.threadSendingReport = function () {
    while (true) {
      var target = reporter.sendingQueue.shift(0, 1)
      if (target != null) {
        if (!target.rank) target.rank = 16
        if (!target.username) target.username = global.config.clientName
        target.message = target.msg
        delete target.msg
        var res = http.postJson(reporter.host, target)
      }
      sleep(200)
    }
  }

  threads.start(this.threadSendingReport)
}
var method = global.devServer.initCallBack
global.devServer = new self.devServer()
self = {}
method()