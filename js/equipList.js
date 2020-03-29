self.info = function (target) {
  var equipName = target.findOne(id("equip_name")).text()
  var equipLevel = target.findOne(id("uni_desc")).text()
  var equipServerInfo = target.findOne(id("tv_server_info")).text()
  var equitPriceInt = target.findOne(id("txt_price_int")).text()
  return {
    name: equipName,
    level: equipLevel,
    server: equipServerInfo,
    price: equitPriceInt.replace(',', '')
  }
}
self.fullList = () => {
  var r = id('flowlistview_list').findOne()
  if (r === null) {
    global.devServer.debug('ListItemIsNull')
    return null
  }
  return r
}

self.fullListItem = (list, index) => {
  if (!index) index = 0
  var result = list.children()[index].findOne(id("main"))
  if (result === null) {
    global.devServer.error('List Item Have Value But Result Is Null')
    return null
  }
  return result
}

self.listItem = function (index) {
  if (!index) index = 0
  var r = global.equipList.fullList()
  var result = this.global.equipList.fullListItem(r, index)
  return result
}

self.resetList = () => {
  var btn_price = id("txt_text").className("android.widget.TextView").text("价格").findOne()
  if (!btn_price.selected) {
    global.devServer.debug('click btn_price')
    btn_price.parent().parent().click()
    sleep(800)
  }
}

self.refreshList = (returnItemCount) => {
  global.devServer.debug('equipList.refreshList')
  global.equipList.resetList()
  var btn_new = id("txt_text").className("android.widget.TextView").text("最新").findOne().parent().parent()
  btn_new.click()
  var list = global.equipList.fullList()
  var current = global.equipList.fullListItem(list)
  var currentItem = global.equipList.info(current)
  var tryTime = 50
  while (tryTime > 0) {
    tryTime -= 1
    sleep(100)
    list = global.equipList.fullList()
    var newItem = global.equipList.fullListItem(list)
    var newItemInfo = global.equipList.info(newItem)
    if (JSON.stringify(currentItem) != JSON.stringify(newItemInfo)) {
      // 刷新完成
      global.devServer.warn(JSON.stringify({
        title: '刷新完成',
        status: 0,
        item: newItemInfo
      }))
      var result = []
      for (var i = 0; i < returnItemCount; i++) {
        var resultItem = global.equipList.fullListItem(list, i)
        var resultItemInfo = global.equipList.info(resultItem)
        global.devServer.debug(resultItemInfo)

        result.push(resultItemInfo)
      }
      return result
    }
  }
  global.devServer.error('equipList refresh timeout')
  return null
}

self.enterGood = (index) => {
  return global.equipBuy.enterGood(index)
}
self.activity = 'com.netease.cbg.activities.EquipListActivity'

var method = global.equipList.initCallBack

global.equipList = self
self = {}
method()