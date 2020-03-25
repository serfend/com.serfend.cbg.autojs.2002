evalJs('init', () => {
  evalJs('messageCallBack', () => {
    evalJs('equipList', () => {
      evalJs('homePage', () => {
        evalJs('equipBuy', () => {
          evalJs('equipPay', () => {
            global.devServer.debug('load serversetting')
            execJs('server_setting')
            global.devServer.debug('load complete serversetting')

            var client = new global.tcp.Tcp(global.config.serverHost, 16555)
            client.onMessage = (e) => {
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
                  client: client
                })
              }
            }
            client.onDisconnect = (e) => { global.devServer.debug(e) }
            client.heartBeatPackage = {
              Title: 'msgHeartBeat'
            }

            var initPackage = {
              Title: 'rpClientConnect',
              Name: global.config.clientAlias,
              Version: global.config.versionInfo,
              Type: 'phone',
              DeviceId: global.config.clientName
            }

            client.sendJson(JSON.stringify(initPackage))
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

  global.devServer.report(JSON.stringify({
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