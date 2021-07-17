self.activity = 'com.netease.cbgbase.e.c'
self.payActivity = 'com.netease.cbg.activities.WalletPayActivity'
self.pswActivity = 'android.app.Dialog'
self.payingActivity = 'com.netease.epay.sdk.pay.ui.PayingActivity'
self.payCurrent = (psw, needConfirm) => {
  global.devServer.debug('equipPay.payCurrent:' + needConfirm)
  if (needConfirm) {
    var btn = id("btn_confirm").findOne()
    btn.click()
  }
  global.devServer.debug('waitForActivity equipPay.payActivity')
  waitForActivity(global.equipPay.payActivity)
  var payBtn = id("btn_confirm_pay").findOne()
  payBtn.click()
  var payingAcTryTime = 50
  global.tcp_client.pause = true
  global.devServer.warn('input password:' + psw)
  sleep(1000)
  var ca = currentActivity()
  global.devServer.debug('waitForActivity equipPay.pswActivity..' + ca)
  while (ca != global.equipPay.payingActivity && ca != global.equipPay.pswActivity) {
    if (payingAcTryTime == 0) break
    payingAcTryTime--
    sleep(150)
    global.devServer.debug('tryNewTimes..' + ca)
    ca = currentActivity()
  }
  if (payingAcTryTime <= 0) {
    global.devServer.error('pay activity not found')
  }
  global.devServer.warn('wating for input window')
  var pswInputWindow = id('fl_content').findOne()
  psw = psw.toString()
  sleep(1000)
  for (var i = 0; i < psw.length; i++) {
    console.log('输入', psw[i])
    global.keyBoard.keyDown(psw[i])
    sleep(50)
  }
  sleep(1000)
  toast('付款完毕')
  sleep(10000)
  global.tcp_client.pause = false
}


var method = global.equipPay.initCallBack
global.equipPay = self
self = {}
method()