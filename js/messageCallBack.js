self.messageCallBackData = {
  cbQueue: [],
  running: false // 占用ui的线程需要进行单线程执行
}
self.invoke = (title, e) => {
  if (global.messageCallBack.messageCallBackData.running) {
    global.messageCallBack.msgHeartBeat(e)
    return false
  }
  if (!global.messageCallBack[title]) {
    console.warn('cmd[' + title + '] have no callback insolve')
    global.messageCallBack.default(e)
  } else {
    global.devServer.debug('messageCallBack.invoke()' + title)
    global.messageCallBack.messageCallBackData.cbQueue.push({
      cb: global.messageCallBack[title],
      e: e,
      title: title
    })
  }
}

self.threadRunCallBack = function () {
  while (true) {
    var newTask = global.messageCallBack.messageCallBackData.cbQueue.shift(0, 1)
    if (newTask) {
      var readyToRun = newTask.cb(newTask.e)
      // TODO 日后需要支持多线程
    }
    sleep(10)
  }
}

self.default = (e) => {
  global.devServer.debug('default cmd callback:' + JSON.stringify(e.data))
  return true
}
// 服务器设置终端名称
self.cmdSetClientName = (e) => {
  var newName = e.data.NewName
  if (e.data.NewName == null) {
    newName = global.config.clientAlias
    // console.warn('invalid new clientName')
    // return
  }
  e.client.sendJson(JSON.stringify({
    Title: 'rpNameModefied',
    NewName: newName
  }))
  global.devServer.debug('client name modefied:' + newName)
  global.config.localStorage.put('config.clientAlias', newName)
  return true
}

// 服务器心跳包
self.msgHeartBeat = (e) => {
  lastRunOperation = new Date()
  e.client.sendHeartBeat(false)
  return true
}

self.newBill = (e) => {
  global.messageCallBack.messageCallBackData.running = true
  var psw = global.config.psw
  // global.equipList.enterGood(0)
  // global.equipBuy.buyCurrent(psw)
  // var targetItem = {"name":"木兰行","level":"3转169级","server":"天界-龙城飞将","price":"344"}
  // global.main.buyGood(targetItem)
  var data = e.data
  var targetItem = {
    name: data.Equip.Name,
    level: data.Equip.Level,
    server: data.Equip.Server,//此处传回的Server名称无`天界-`前缀
    price: data.Equip.PriceRequire,
    goodsCreate: data.Equip.GoodsCreate,
    psw: data.billInfo.psw
  }
  global.devServer.warn(JSON.stringify({
    title: '新的订单',
    data: {
      targetItem: targetItem,
      rawData: data
    }
  }))
  const start_bill_delay = Number(global.config.localStorage.get('start_bill_delay', 600e3))
  targetItem.startDate = new Date(targetItem.goodsCreate).getTime() - 8 * 3600e3 + start_bill_delay
  console.warn('订单下单' + new Date(targetItem.goodsCreate) + ',' + targetItem.startDate + ',' + new Date(targetItem.startDate) + ',发布时间' + targetItem.goodsCreate)

  global.main.buyGood(targetItem)
  global.equipList.resetList()
  global.devServer.warn(JSON.stringify({
    title: '新的订单处理完成',
    data: {
      targetItem: targetItem,
      rawData: data
    }
  }))
  global.messageCallBack.messageCallBackData.running = false
  return true
}


var method = global.messageCallBack.initCallBack
global.messageCallBack = self
self = {}
var runner = threads.start(global.messageCallBack.threadRunCallBack)
method()