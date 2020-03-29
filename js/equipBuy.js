self.activity = 'com.netease.cbg.activities.EquipInfoActivity'
self.buyerActivity = 'com.netease.cbg.activities.ChoseRoleActivity'
self.orderActivity = 'com.netease.cbg.activities.AddOrderActivity'
self.enterGood = (index) => {
  var ca = currentActivity()
  global.devServer.debug(ca + '.enterGood:' + index)
  if (ca == global.equipBuy.activity) {
    back()
    waitForActivity(global.equipList.activity)
    return global.equipBuy.enterGood(index)
  } else if (ca == global.equipBuy.orderActivity) {
    back()
    waitForActivity(global.equipBuy.activity)
    return global.equipBuy.enterGood(index)
  } else if (ca == global.equipBuy.buyerActivity) {
    back()
    waitForActivity(global.equipBuy.orderActivity)
    return global.equipBuy.enterGood(index)
  }
  else {
    var list = global.equipList.fullList()
    var item = list.children()[index]
    item.click()
    global.devServer.debug('waitForActivity equipBuy.activity')
    waitForActivity(global.equipBuy.activity)
    global.devServer.debug(currentActivity())
  }
}

self.buyCurrent = (psw) => {
  global.devServer.debug('equipBuy.clickBuyButtton()')
  var needConfirm = global.equipBuy.clickBuyButtton() // 公示期预定的会弹窗，需要确认
  if (needConfirm == null) return false
  global.devServer.debug('equipBuy.getPlayerList()')
  var buyerList = global.equipBuy.getPlayerList()
  global.devServer.warn(JSON.stringify({
    title: 'buyer',
    data: buyerList
  })) // 上报当前账号信息
  if (buyerList.length > 0) {
    global.equipBuy.selectBuyer(global.config.buyerSelectIndex)
    global.devServer.debug('equipBuy.payCurrent')
    global.equipBuy.payCurrent(psw, needConfirm)
  } else {
    back()
    sleep(500)
    back()
  }
}

self.payCurrent = (psw, needConfirm) => {
  global.equipBuy.clickPayButton()
  return global.equipPay.payCurrent(psw, needConfirm)
}

// 获取可用的收货角色列表
self.getPlayerList = () => {
  global.devServer.debug('checkBuyerList')
  var listEnterButton = className("android.widget.TextView").text("请选择收货角色").exists()
  if (listEnterButton) {
    listEnterButton = className("android.widget.TextView").text("请选择收货角色").findOne(500)
    listEnterButton.parent().parent().click() // linerLayout.click
  }
  else {
    var defaultBuyerName = id('tv_buyer_name').findOne()
    global.devServer.debug('found defaultBuyerName')
    defaultBuyerName.parent().parent().click()
  }
  global.devServer.debug('waitForBuyerActivity')
  waitForActivity(global.equipBuy.buyerActivity)
  global.devServer.debug('listViewRoles')
  var list = id('listview_roles').findOne()
  global.devServer.debug('load all buyer')
  var buyers = list.children().map(i => {
    if (i.children().length == 0) return null
    var item = i.children()[0].children()[0].children()[0].children()[1]
    var des = item.children()[1].text()
    var header = item.children()[0]
    var name = header.children()[0].text()
    var level = header.children()[1].children()[1].text()
    return {
      name: name,
      level: level,
      des: des
    }
  }).filter(i => i != null)
  if (buyers.length == 0) {
    global.devServer.error('current server dont have buyer')
  }
  return buyers
}

self.selectBuyer = (index) => {
  global.devServer.debug('listViewRoles')
  var list = id('listview_roles').findOne()
  global.devServer.debug('select buyer')
  try {
    list.children()[index].children()[0].click()
    list.children()[index].children()[0].click()
  } catch (e) {
    global.devServer.error(e)
  }

  global.devServer.debug('waitForActivity')
  waitForActivity(global.equipBuy.orderActivity)
}

self.clickBuyButtton = () => {
  var isDirectBuy = false
  sleep(1500)
  for (var i = 0; i < 3; i++) {
    var btn = id('btn_buy').findOne(500)//btnArea.children()[1]
    if (btn == null) {
      global.devServer.error('buy_btn now find')
      return null
    } else {
      isDirectBuy = btn.text() == '公示期预订'
      btn.click()
      break
    }
  }
  global.devServer.debug('clickBuyButtton.waitForActivity() orderActivity')
  waitForActivity(global.equipBuy.orderActivity)
  return isDirectBuy
}

self.clickPayButton = () => {
  global.devServer.debug('clickPayButton')
  var btnArea = id("layout_add_order").findOne()
  var btn = btnArea.children()[1]
  btn.click()
}


var method = global.equipBuy.initCallBack
global.equipBuy = self
self = {}
method()