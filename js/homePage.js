self.activity = 'com.netease.xyqcbg.activities.HomeActivity'
self.enterEquipList = (equipListActivity) => {
  var ca = currentActivity()
  if (ca == equipListActivity) return true
  if (ca == global.homePage.activity) {
    click('角色')
    waitForActivity(equipListActivity)
    return true
  }
  return false
}

var method = global.homePage.initCallBack
global.homePage = self
method()