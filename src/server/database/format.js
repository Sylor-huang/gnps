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

export function formatDate(time) {
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
  return [year, month, day]
}