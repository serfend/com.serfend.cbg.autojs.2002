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
    // console.log('tcp.send:' + msg)
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
        if (tmpMsg == 0) {
          // console.log('newMsg:'+buffer.length)
          tcp.onMessage({ data: buffer })
          buffer = []
        } else
          buffer.push(tmpMsg)
      } catch (e) {
        console.error(e)
        tcp.disconnect()
        return
      }
    }
  }

  this.sendHeartBeat = function (needReply) {
    if (tcp.heartBeatPackage) {
      tcp.heartBeatPackage.Stamp = new Date().getTime()
      tcp.heartBeatPackage.NeedReply = needReply
      tcp.sendJson(JSON.stringify(tcp.heartBeatPackage))
    }
  }

  this.innerRecvReader = function () {
    while (tcp.connected) {
      tcp.sendHeartBeat(true)
      sleep(2000)
    }
  }
  var recvThread = threads.start(this.innerRecv)
  var recvReadThread = threads.start(this.innerRecvReader)
}

var method = global.tcp.initCallBack
global.tcp = self
self = {}
method()

// var client = new self.Tcp('192.168.43.222', 8009)
// client.onMessage = (e) => {
//   var str = String.fromCharCode.apply(null, e.data)
//   console.log(str)
//   client.send(JSON.stringify({
//     Title: 'usrMsg',
//     data: str
//   }))
// }
// client.onDisconnect = (e) => {
//   console.log('client disconnect')
// }
// client.heartBeatPackage = {
//   Title: 'msgHeartBeat'
// }