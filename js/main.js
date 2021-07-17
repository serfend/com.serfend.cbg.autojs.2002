auto()
evalJs('init', () => {
  evalJs('messageCallBack', () => {
    evalJs('equipList', () => {
      evalJs('homePage', () => {
        evalJs('equipBuy', () => {
          evalJs('equipPay', () => {
            global.devServer.debug('load serversetting')
            // toast('测试屏幕点击')
            global.keyBoard = new global.config.keyBoard()
            // sleep(5000)
            // for (let i = 1; i <= 11; i++) {
            //   console.log('测试点击' + i)
            //   global.keyBoard.keyDown(i.toString())
            //   sleep(2000)
            // }
            // toast('测试输入密码')
            // sleep(5000)
            // var psw = '123456123456123456'
            // for (var i = 0; i < psw.length; i++) {
            //   global.keyBoard.keyDown(psw[i])
            //   sleep(500)
            //   if (i % 6 == 5) sleep(5000)
            // }
            execJs('server_setting')
            global.devServer.debug('load complete serversetting')

            global.tcp_client = new global.tcp.Tcp(global.config.serverHost, 16555)
            global.tcp_client.onMessage = (e) => {
              var info = String.fromCharCode.apply(null, e.data)
              global.devServer.debug('fromServer:' + info)
              var data = {}
              try {
                data = JSON.parse(info)
              } catch (e) {
                global.devServer.error('recive server info invalid:' + info)
                return
              }
              if (!data.Title) {
                global.devServer.error('server message is invalid:' + info)
              } else {
                var title = data.Title
                // 使用专门的回调处理
                global.messageCallBack.invoke(title, {
                  data: data,
                  client: global.tcp_client
                })
              }
            }
            global.tcp_client.onDisconnect = (e) => { global.devServer.debug(e) }
            global.tcp_client.heartBeatPackage = {
              Title: 'msgHeartBeat'
            }

            var initPackage = {
              Title: 'rpClientConnect',
              Name: global.config.clientAlias,
              Version: global.config.versionInfo,
              Type: 'phone',
              DeviceId: global.config.clientName
            }
            global.tcp_client.sendJson(JSON.stringify(initPackage))
            global.equipList.resetList()

            // 每隔10分钟检查一次是否需要更新
            // setTimeout(() => {
            //   evalJs('checkAction')
            // }, 600000)

            // 付款样例
            // console.time('mainAction')
            // console.log(global.main.refreshMain(5))
            // global.equipList.enterGood(1)
            // var success = global.equipBuy.buyCurrent('258147')
            // console.timeEnd('mainAction')

          })
        })
      })
    })
  })
})
self.refreshMain = (refreshCount) => {
  if (global.homePage.enterEquipList(global.equipList.activity)) {
    // 获取前n个商品
    var newItems = global.equipList.refreshList(refreshCount)
    return newItems
  } else {
    global.devServer.error('enter equiplist fail:' + currentActivity())
  }
}

self.buyGood = (goodItem) => {
  var refreshCount = global.config.refreshCount
  var items = global.main.refreshMain(refreshCount)
  if (items == null) return
  for (var i = 0; i < items.length; i++) {
    var item = items[i]
    var checkResult = {
      nameEqual: goodItem.name == item.name,
      levelEqual: goodItem.level == item.level,
      serverEqual: item.server.indexOf(goodItem.server) > 0,
      priceEqual: Math.abs(Number.parseFloat(goodItem.price) - Number.parseFloat(item.price))
    }
    if (checkResult.nameEqual && checkResult.levelEqual && checkResult.serverEqual && checkResult.priceEqual < 0.01) {
      console.log('buy item:' + i)
      global.equipList.enterGood(i)
      return global.equipBuy.buyCurrent(goodItem.psw)
    }
    items[i].checkResult = checkResult
  }

  global.devServer.error(JSON.stringify({
    title: "target good Item not found",
    data: {
      target: goodItem,
      items: items
    }
  }))
  global.devServer.error('target good Item not found:' + JSON.stringify(goodItem))
  return false
}

var method = global.main.initCallBack
global.main = self
self = {}
method()