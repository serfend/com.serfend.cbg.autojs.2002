// TODO 之后可以将config与服务器相连接，并绑定到ui界面，实现设置的同步
// 基本方法
self.UUID = function () {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}


// 基本信息
self.appName = 'auto_cbg'
self.localStorage = storages.create(self.appName)
self.clientName = self.localStorage.get('config.clientName', "")
self.clientAlias = self.localStorage.get('config.clientAlias')
if (!self.clientAlias) self.clientAlias = device.product
self.versionInfo = 'v1.0.7 20200406'
self.apiHost = 'http://39.97.229.104'
self.serverHost = self.localStorage.get('serversetting_ip', '111.225.10.139') // 脚本控制终端

// 运行信息
self.refreshCount = 5 // 刷新后获取前几个商品
self.buyerSelectIndex = 0 // 使用第几个角色购买
self.psw = '123456' // 默认密码
self.keyBoard = function () {
  var ra = new RootAutomator()
  this.xBegin = -device.width / 6
  this.yBegin = 720
  this.xLength = device.width / 3
  this.yLength = 50
  this.keyDown = (val) => {
    if (val == 0) val = 11
    var x = (val - 1) % 3 + 1
    var y = Math.floor((val - 1) / 3) + 1
    var posX = x * this.xLength + this.xBegin + 5 * (Math.random() * 0.5 + 1)
    var posY = y * this.yLength + this.yBegin + 5 * (Math.random() * 0.5 + 1)
    ra.press(posX, posY, 100)
  }
}

if (self.clientName == "") {
  self.localStorage.put('config.clientName', self.UUID())
}

for (var item in self) {
  var itemType = typeof (self[item])
  if (itemType == 'number' || itemType == 'string') {
    var prevValue = self[item]
    self[item] = self.localStorage.get('config.' + item, prevValue)
    var addition = ''
    if (self[item] != prevValue) addition = ' prev:(' + prevValue + ')'
    console.log(item + ":" + self[item])
  }
}


var method = global.config.initCallBack
global.config = self
method()