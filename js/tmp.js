

main = function () {
  var item = id('cb_wallet_use').findOne()
  toast(item)
  item.click()
}

var thread = threads.start(main)
// while (thread.isAlive()) {
//   sleep(1000)
// }
sleep(15000)
thread.interrupt()
console.hide()