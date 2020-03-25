

main = function () {
  var payingAcTryTime = 50
  self={}
    
  self.pswActivity = 'android.app.Dialog'
  self.payingActivity = 'com.netease.epay.sdk.pay.ui.PayingActivity'
  sleep(1000)
  var ca = currentActivity()
  console.log('waitForActivity equipPay.pswActivity..' + ca)
  while (ca != self.payingActivity && ca != self.pswActivity && payingAcTryTime > 0) {
    payingAcTryTime--
    sleep(150)
    console.log('tryNewTimes..' + ca)
    ca = currentActivity()
  }
  console.log('success')
  return
  self = {}
  self.keyBoard = function () {
    this.xBegin = -device.width / 6
    this.yBegin = 1600
    this.xLength = device.width / 3
    this.yLength = 150
    this.keyDown = (val) => {
      if (val == 0) val = 11
      var x = (val - 1) % 3 + 1
      var y = Math.floor((val - 1) / 3) + 1
      var posX = x * this.xLength + this.xBegin
      var posY = y * this.yLength + this.yBegin
      console.log("click:" + posX + ',' + posY)
      press(posX, posY, 50)
    }
  }
  // var k = new self.keyBoard()
  // for (var i = 0; i < 10; i++) {
  //   k.keyDown(i)
  //   k.keyDown(12)
  // }
}

var thread = threads.start(main)
// while (thread.isAlive()) {
//   sleep(1000)
// }
sleep(15000)
thread.interrupt()
console.hide()