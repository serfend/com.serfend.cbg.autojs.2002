importClass("java.io.DataInputStream")
importClass("java.io.DataOutputStream")
importClass("java.io.OutputStreamWriter")
importClass("java.io.BufferedWriter")
importClass('java.io.BufferedReader')
importClass('java.io.IOException')
importClass('java.io.InputStream')
importClass('java.io.InputStreamReader')
importClass('java.io.OutputStream')
importClass('java.io.PrintWriter')
importClass('java.net.Socket')
importClass('java.net.UnknownHostException')

self.Tcp = function (ip, port) {
  console.log('connect to ' + ip + ':' + port)
  this.socket = new Socket(ip, port)
  this.connected = true
  this.outputStream = this.socket.getOutputStream()
  this.bw = new DataOutputStream(this.outputStream)
  this.inputStream = this.socket.getInputStream() //获取一个输入流，接收服务端的信息
  this.inputStreamReader = new InputStreamReader(this.inputStream) //包装成字符流，提高效率
  this.bufferedReader = new BufferedReader(this.inputStreamReader) //缓冲区
  this.heartBeatPackage = null
  this.onConnect = (e) => { }
  this.onDisconnect = (e) => { }
  this.onMessage = (e) => { }
  this.onError = (e) => { }
  this.disconnect = function () {
    if (!this.connected) {
      console.error('tcp.disconnect:allready disconnect')
      return
    }
    this.connected = false
    this.outputStream.close()
    this.inputStream.close()
    this.socket.close()
    recvThread.interrupt()
    recvReadThread.interrupt()
    this.onDisconnect({ date: new Date() })
  }
  this.send = function (msg) {
    console.log('tcp.send:' + msg)
    this.bw.writeBytes(msg)
  }
  this.sendJson = function (msg) {
    // 服务器似乎会对前2个字节单独处理，导致消息分裂，故加一个空消息
    // 但是在打包之后似乎又不会分割前2字节了
    return this.send('<jsonMsg>' + msg + '</jsonMsg>')
  }
  var tcp = this
  var buffer = []

  this.innerRecv = function () {
    while (tcp.connected) {
      try {
        var tmpMsg = tcp.bufferedReader.read()
        buffer.push(tmpMsg)
      } catch (e) {
        console.error(e)
        tcp.disconnect()
        return
      }
    }
  }
  this.innerRecvReader = function () {
    var lastBufLength = 0
    var msgIntentInterval = 10
    var noChangeTime = 0
    while (true) {
      sleep(msgIntentInterval)
      var thisBufLength = buffer.length
      if (thisBufLength != lastBufLength) {
        msgIntentInterval = 10
        noChangeTime = 0
        lastBufLength = thisBufLength
      }
      else {
        noChangeTime++
        if (noChangeTime % 100 == 0) {
          if (tcp.heartBeatPackage != null) {
            tcp.sendJson(JSON.stringify(tcp.heartBeatPackage))
          }
        }
        if (msgIntentInterval < 1000) { msgIntentInterval++ }
        if (lastBufLength > 0 && noChangeTime > 10) {
          tcp.onMessage({
            data: buffer
          })
          lastBufLength = 0
          buffer = []
        }
      }
    }
  }
  var recvThread = threads.start(this.innerRecv)
  var recvReadThread = threads.start(this.innerRecvReader)
}

var method = global.tcp.initCallBack
global.tcp = self
self = {}
method()