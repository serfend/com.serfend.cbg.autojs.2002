importClass("java.io.DataInputStream")
importClass("java.io.DataOutputStream")
importClass("java.io.OutputStreamWriter")
importClass("java.io.BufferedWriter")
importClass('java.io.BufferedReader')
importClass('java.io.IOException')
importClass('java.io.InputStream')
importClass('java.io.InputStreamReader')
importClass('java.io.OutputStream')
importClass('java.io.PrintWriter')
importClass('java.net.DatagramPacket')
importClass('java.net.InetAddress')
importClass('java.net.DatagramSocket')
importClass('java.net.UnknownHostException')
importClass('java.lang.Byte')
importClass('java.lang.Integer')
const Udp = function (ip, port) {
  console.log('udp to ' + ip + ':' + port)
  this.ip = ip
  this.port = port
  this.socket = new DatagramSocket();
  this.currnet_db = { total: 0, valid: 0, head_invalid: 0, arm_invalid: 0, leg_invalid: 0 }
  const data = '0E A6 05 {total} {valid} {head_invalid} {arm_invalid} {leg_invalid} 0D 0A'
  this.to_value = (v) => {
    const d = Number(v % 65536).toString(16)
    return '0000'.substr(0, 4 - d.length) + d
  }
  this.build_data = () => {
    const db = this.currnet_db
    let to_send = data
    Object.keys(db).map(i => {
      to_send = to_send.replace('{' + i + '}', this.to_value(db[i]))
    })
    to_send = to_send.replace(/ /g, '')
    to_send = to_send.toLowerCase()
    const length = to_send.length / 2
    console.log(to_send)
    const result = java.lang.reflect.Array.newInstance(java.lang.Character.TYPE, length)
    for (let i = 0; i < to_send.length; i += 2) {
      let d = to_send.substr(i, 2)
      console.log('byte', i, d)
      result[i / 2] = (Integer.parseInt(d, 16))
    }
    return new java.lang.String(result).getBytes()
  }
  this.send_pkg = () => {
    const db = this.currnet_db
    db.total = db.valid + db.head_invalid + db.arm_invalid + db.leg_invalid
    const data = this.build_data()
    console.log('sending', data)
    const packet = new DatagramPacket(data, data.length, InetAddress.getByName(ip), port);
    this.socket.send(packet)
  }

  this.innerRecv = function () {
    while (true) {
      try {
        const data = new byte[1024]
        const p = new DatagramPacket(data, data.length)
        this.socket.receive(p)
        console.log(p)
      } catch (e) {
        console.error(e)
        return
      }
    }
  }
  this.recvThread = threads.start(this.innerRecv)

}

const udp = new Udp('192.168.8.102', 8080)