/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

export function validPassword(password) {
  // 密码至少需要 6 位
  return password.length >= 6;
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

export function formatLocalTime(time) {
  let format_time;
  if (time !== undefined) {
    format_time = typeof time === 'number' ? new Date(time * 1000) : new Date(time);
  } else {
    format_time = new Date();
  }
  // 获取年月日
  const year = format_time.getFullYear();
  const month = String(format_time.getMonth() + 1).padStart(2, '0');
  const day = String(format_time.getDate()).padStart(2, '0');

  // 获取时分秒
  const hours = String(format_time.getHours()).padStart(2, '0');
  const minutes = String(format_time.getMinutes()).padStart(2, '0');
  const seconds = String(format_time.getSeconds()).padStart(2, '0');

  // 获取毫秒
  const milliseconds = String(format_time.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export function sliceString(str, len) {
  if (!str) return "";
  if (str.length <= len * 2) return str;
  return `${str.slice(0, len)}...${str.slice(-len)}`;
};

export function sliceEmailString(str, len) {
  if (!str) return "";
  const emailName = str.split("@")[0]
  if (emailName.length <= len * 2) return emailName;
  return `${emailName.slice(0, len)}...${emailName.slice(-len)}`;
};

export function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  // 使用 UTC 时间来计算差值
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) {
    return `${seconds}s ago`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function tableIndex(index, pagies) {
  return (pagies.page - 1) * pagies.pageSize + 1 + index;
}

export function formatKeys(input) {
  const result = input
    .replace(/_/g, ' ') // 将下划线替换为空格
    .replace(/\b\w/g, (char) => char.toUpperCase()); // 将每个单词的首字母大写
  return result;
}
