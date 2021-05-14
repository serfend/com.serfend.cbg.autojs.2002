'ui';

var appName = 'auto_cbg'
const db = storages.create(appName)
var ServerSetting = (function () {
  //继承至ui.Widget
  util.extend(ServerSetting, ui.Widget)

  function ServerSetting() {
    ui.Widget.call(this)
    var settingname_ip = 'config.serverHost'
    this.defineAttr("ip", (view, attr, value, defineSetter) => {
      view._ip.setText(value.toString())
    })
    var settingname_clientName = 'config.clientAlias'
    this.defineAttr("clientName", (view, attr, value, defineSetter) => {
      view._clientName.setText(value.toString())
      db.put(settingname_clientName, value)
    })
    this[settingname_ip + 'afterTextChanged'] = function (value) {
      db.put(settingname_ip, value.toString())
    }
    this[settingname_clientName + 'afterTextChanged'] = function (value) {
      db.put(settingname_clientName, value.toString())
    }
    ServerSetting.prototype.onFinishInflation = function (view) {
      view._ip.setText(db.get(settingname_ip, '1.1.1.1'))
      view._clientName.setText(db.get(settingname_clientName, device.product))
      view._ip.addTextChangedListener(new android.text.TextWatcher({ afterTextChanged: this[settingname_ip + 'afterTextChanged'] }))
      view._clientName.addTextChangedListener(new android.text.TextWatcher({ afterTextChanged: this[settingname_clientName + 'afterTextChanged'] }))
    }
  }
  ServerSetting.prototype.render = function () {
    return (
      <vertical>
        <text text="服务器ip" textColor="black" textSize="16sp" marginTop="16" />
        <input id="_ip" textSize="16sp" margin="4" />
        <text text="终端名称" textColor="black" textSize="16sp" marginTop="16" />
        <input id="_clientName" margin="0 16" />
      </vertical>
    )
  }
  ServerSetting.prototype.getInput = function () {
    return this.view._input.getText()
  }
  ui.registerWidget("ServerSetting", ServerSetting)
  return ServerSetting
})()

ui.layout(
  <vertical >
    <appbar>
      <toolbar id="toolbar" title="设置" />
      <tabs id="tabs" />
    </appbar>
    <viewpager id="viewpager">
      <frame>
        <vertical>
          <ServerSetting />
        </vertical>
      </frame>
      <frame>
        <vertical>
          <checkbox id="_billDisableWalletCheck" text="是否取消勾选钱包" marginLeft="4" marginRight="6" />
        </vertical>
      </frame>
      <frame>
        <vertical>
          <ServerSetting />
        </vertical>
      </frame>
    </viewpager>
    <fab id="add" w="auto" h="auto" src="@drawable/ic_add_black_48dp"
      margin="16" layout_gravity="bottom|right" tint="#ffffff" />
  </vertical>
)
const bCheck = ui._billDisableWalletCheck
const billDisableWalletCheck = 'billDisableWalletCheck'
bCheck.setChecked(db.get(billDisableWalletCheck, false))
bCheck.on('click', (v) => {
  db.put(billDisableWalletCheck, v.checked)
})
ui.viewpager.setTitles(["服务器", "下单设置", "未开放"])
ui.tabs.setupWithViewPager(ui.viewpager)




