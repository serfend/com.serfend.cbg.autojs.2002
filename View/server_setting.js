'ui';


var ServerSetting = (function () {
  //继承至ui.Widget
  util.extend(ServerSetting, ui.Widget)

  function ServerSetting() {
    var appName = 'auto_cbg'
    ServerSetting.prototype.config = storages.create(appName)

    ui.Widget.call(this)
    var settingname_ip = 'config.serverHost'
    this.defineAttr("ip", (view, attr, value, defineSetter) => {
      view._ip.setText(value.toString())
    })
    var settingname_clientName = 'config.clientAlias'
    this.defineAttr("clientName", (view, attr, value, defineSetter) => {
      view._clientName.setText(value.toString())
      ServerSetting.prototype.config.put(settingname_clientName, value)
    })
    this[settingname_ip + 'afterTextChanged'] = function (value) {
      ServerSetting.prototype.config.put(settingname_ip, value.toString())
    }
    this[settingname_clientName + 'afterTextChanged'] = function (value) {
      ServerSetting.prototype.config.put(settingname_clientName, value.toString())
    }
    ServerSetting.prototype.onFinishInflation = function (view) {
      view._ip.setText(ServerSetting.prototype.config.get(settingname_ip, '1.1.1.1'))
      view._clientName.setText(ServerSetting.prototype.config.get(settingname_clientName, device.product))
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
          <ServerSetting />
        </vertical>
      </frame>
      <frame>
        <vertical>
          <ServerSetting />
        </vertical>
      </frame>
    </viewpager>
  </vertical>
)

ui.viewpager.setTitles(["服务器", "未开放", "未开放"])
ui.tabs.setupWithViewPager(ui.viewpager)




