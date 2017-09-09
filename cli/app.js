var socketIO = require('socket.io-client')
var child_process = require('child_process')
var os = require('os')

const address = "http://vpn.redkill2108.me:5000"

var old_rx = 0
var old_tx = 0

var socket = socketIO(address)

socket.on('connect', function () {
    console.log('[Connected]')
    sync()
    setInterval(function () { sync() }, 1000)
})

function get_uptime () {
    return child_process.execSync("cat /proc/uptime", {encoding: 'utf-8'}).split(' ')[0]
}

function get_rxtx () {
    var out = child_process.execSync('/sbin/ifconfig eth0 | /bin/grep "RX bytes"', {encoding: 'utf-8'})
    out = out.trim()
    out = out.replace('RX bytes:', '')
    out = out.replace('TX bytes:', '')
    rx_tx = out.split(' ')
    var rx = Math.round(((rx_tx[0] - old_rx) / 1024) * 100) / 100
    var tx = Math.round(((rx_tx[4] - old_tx) / 1024) * 100) / 100
    old_rx = rx
    old_tx = tx
    return { tx: tx, rx: rx }
}

function get_cpu () {
    var cpu = 0
    var out = child_process.execSync("ps -e -o pcpu", {encoding: 'utf-8'})
    out = out.split("%CPU\n")[1].trim().split("\n")
    for (var c in out) {
        cpu += parseFloat(out[c])
    }
    return cpu
}

function get_storage () {
    var disks = []
    var re = /\S+/g
    var out = child_process.execSync('df -hT | grep -vE "tmpfs|rootfs|Filesystem"', {encoding: 'utf-8'}).replace(/^\t+|\r+|\s+|\s+$/g, ' ').split("\n")
    for (var i in out) {
        var d = out[i].trim().split(' ')
        disks.push({name: d[6], usage: d[5].replace('%', '')})
    }
    
    return disks
}

function get_ram () {
    var re = /\S+/g
    var out = child_process.execSync('free -mo', {encoding: 'utf-8'}).split("\n")[1].replace(/^\t+|\r+|\s+|\s+$/g, ' ').split(' ')
    return Math.round((parseFloat(out[2]) - parseFloat(out[5]) - parseFloat(out[6])) / parseFloat(out[1]) * 100)
}


function sync () {
    var data = {id: os.hostname(), uptime: get_uptime(), net: get_rxtx(), cpu: get_cpu(), disks: get_storage(), ram: get_ram()}
    console.log(data)
    socket.emit('sync', data)
}

