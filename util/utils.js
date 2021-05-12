
// /**
//  * Created by jiachenpan on 16/11/18.
//  */

// /**
//  *比较两个日期之间相差的天数
//  *
//  * @export
//  * @param {*} sDate1
//  * @param {*} sDate2
//  * @returns
//  */
// self.datedifference = (sDate1, sDate2) => {
//   // sDate1和sDate2是2006-12-18格式
//   var dateSpan, iDays
//   sDate1 = Date.parse(sDate1)
//   sDate2 = Date.parse(sDate2)
//   dateSpan = sDate2 - sDate1
//   dateSpan = Math.abs(dateSpan)
//   iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
//   return iDays
// }

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
self.parseTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null
  }
  if (time === null) return null
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
// /**
//  * @param {number} time
//  * @param {string} option
//  * @returns {string}
//  */
// self.formatTime = (time, option) => {
//   if (('' + time).length === 10) {
//     time = parseInt(time) * 1000
//   } else {
//     time = +time
//   }
//   const d = new Date(time)
//   const now = Date.now()

//   const diff = (now - d) / 1000

//   if (diff < 30) {
//     return '刚刚'
//   } else if (diff < 3600) {
//     // less 1 hour
//     return Math.ceil(diff / 60) + '分钟前'
//   } else if (diff < 3600 * 24) {
//     return Math.ceil(diff / 3600) + '小时前'
//   } else if (diff < 3600 * 24 * 2) {
//     return '1天前'
//   }
//   if (option) {
//     return parseTime(time, option)
//   } else {
//     return (
//       d.getMonth() +
//       1 +
//       '月' +
//       d.getDate() +
//       '日' +
//       d.getHours() +
//       '时' +
//       d.getMinutes() +
//       '分'
//     )
//   }
// }

// /**
//  * @param {string} url
//  * @returns {Object}
//  */
// self.getQueryObject = (url) => {
//   url = url == null ? window.location.href : url
//   const search = url.substring(url.lastIndexOf('?') + 1)
//   const obj = {}
//   const reg = /([^?&=]+)=([^?&=]*)/g
//   search.replace(reg, (rs, $1, $2) => {
//     const name = decodeURIComponent($1)
//     let val = decodeURIComponent($2)
//     val = String(val)
//     obj[name] = val
//     return rs
//   })
//   return obj
// }

// /**
//  * @param {string} input value
//  * @returns {number} output value
//  */
// self.byteLength = (str) => {
//   // returns the byte length of an utf8 string
//   let s = str.length
//   for (var i = str.length - 1; i >= 0; i--) {
//     const code = str.charCodeAt(i)
//     if (code > 0x7f && code <= 0x7ff) s++
//     else if (code > 0x7ff && code <= 0xffff) s += 2
//     if (code >= 0xDC00 && code <= 0xDFFF) i--
//   }
//   return s
// }

// /**
//  * @param {Array} actual
//  * @returns {Array}
//  */
// self.cleanArray = (actual) => {
//   const newArray = []
//   for (let i = 0; i < actual.length; i++) {
//     if (actual[i]) {
//       newArray.push(actual[i])
//     }
//   }
//   return newArray
// }

// /**
//  * @param {Object} json
//  * @returns {Array}
//  */
// self.param = (json) => {
//   if (!json) return ''
//   return cleanArray(
//     Object.keys(json).map(key => {
//       if (json[key] === undefined) return ''
//       return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
//     })
//   ).join('&')
// }

// /**
//  * @param {string} url
//  * @returns {Object}
//  */
// self.param2Obj = (url) => {
//   const search = url.split('?')[1]
//   if (!search) {
//     return {}
//   }
//   return JSON.parse(
//     '{"' +
//     decodeURIComponent(search)
//       .replace(/"/g, '\\"')
//       .replace(/&/g, '","')
//       .replace(/=/g, '":"')
//       .replace(/\+/g, ' ') +
//     '"}'
//   )
// }

// /**
//  * @param {string} val
//  * @returns {string}
//  */
// self.html2Text = (val) => {
//   const div = document.createElement('div')
//   div.innerHTML = val
//   return div.textContent || div.innerText
// }

// /**
//  * Merges two objects, giving the last one precedence
//  * @param {Object} target
//  * @param {(Object|Array)} source
//  * @returns {Object}
//  */
// self.objectMerge = (target, source) => {
//   if (typeof target !== 'object') {
//     target = {}
//   }
//   if (Array.isArray(source)) {
//     return source.slice()
//   }
//   Object.keys(source).forEach(property => {
//     const sourceProperty = source[property]
//     if (typeof sourceProperty === 'object') {
//       target[property] = objectMerge(target[property], sourceProperty)
//     } else {
//       target[property] = sourceProperty
//     }
//   })
//   return target
// }

// /**
//  * @param {HTMLElement} element
//  * @param {string} className
//  */
// self.toggleClass = (element, className) => {
//   if (!element || !className) {
//     return
//   }
//   let classString = element.className
//   const nameIndex = classString.indexOf(className)
//   if (nameIndex === -1) {
//     classString += '' + className
//   } else {
//     classString =
//       classString.substr(0, nameIndex) +
//       classString.substr(nameIndex + className.length)
//   }
//   element.className = classString
// }

// /**
//  * @param {string} type
//  * @returns {Date}
//  */
// self.getTime = (type) => {
//   if (type === 'start') {
//     return new Date().getTime() - 3600 * 1000 * 24 * 90
//   } else {
//     return new Date(new Date().toDateString())
//   }
// }


// /**
//  * This is just a simple version of deep copy
//  * Has a lot of edge cases bug
//  * If you want to use a perfect deep copy, use lodash's _.cloneDeep
//  * @param {Object} source
//  * @returns {Object}
//  */
// self.deepClone = (source) => {
//   if (!source && typeof source !== 'object') {
//     throw new Error('error arguments', 'deepClone')
//   }
//   const targetObj = source.constructor === Array ? [] : {}
//   Object.keys(source).forEach(keys => {
//     if (source[keys] && typeof source[keys] === 'object') {
//       targetObj[keys] = deepClone(source[keys])
//     } else {
//       targetObj[keys] = source[keys]
//     }
//   })
//   return targetObj
// }

// /**
//  * @param {Array} arr
//  * @returns {Array}
//  */
// self.uniqueArr = (arr) => {
//   return Array.from(new Set(arr))
// }

// /**
//  * @returns {string}
//  */
// self.createUniqueString = () => {
//   const timestamp = +new Date() + ''
//   const randomNum = parseInt((1 + Math.random()) * 65536) + ''
//   return (+(randomNum + timestamp)).toString(32)
// }

// /**
//  * Check if an element has a class
//  * @param {HTMLElement} elm
//  * @param {string} cls
//  * @returns {boolean}
//  */
// self.hasClass = (ele, cls) => {
//   return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
// }

// /**
//  * Add class to element
//  * @param {HTMLElement} elm
//  * @param {string} cls
//  */
// self.addClass = (ele, cls) => {
//   if (!hasClass(ele, cls)) ele.className += ' ' + cls
// }

// /**
//  * Remove class from element
//  * @param {HTMLElement} elm
//  * @param {string} cls
//  */
// self.removeClass = (ele, cls) => {
//   if (hasClass(ele, cls)) {
//     const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
//     ele.className = ele.className.replace(reg, ' ')
//   }
// }

// move utils to global.utils
var method = global.utils.initCallBack
global.utils = self
self = {}

// every module should have this function for async exec
method()
