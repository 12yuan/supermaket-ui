/**
 * 日期格式化工具函数
 */

/**
 * 格式化日期
 * @param {Date|String|Number} date - 日期对象、日期字符串或时间戳
 * @param {String} fmt - 格式化模式，例如：'yyyy-MM-dd hh:mm:ss'
 * @returns {String} 格式化后的日期字符串
 */
export function formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!date) return '';

  // 如果是时间戳（数字），转为日期对象
  if (typeof date === 'number') {
    date = new Date(date);
  }

  // 如果是字符串，尝试转为日期对象
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'));
  }

  if (!(date instanceof Date)) return '';

  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }

  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr((`${o[k]}`).length),
      );
    }
  }

  return fmt;
}

/**
 * 获取相对时间描述
 * @param {Date|String|Number} date - 日期对象、日期字符串或时间戳
 * @returns {String} 相对时间描述，如"刚刚"、"5分钟前"、"2小时前"等
 */
export function getRelativeTime(date) {
  if (!date) return '';

  // 如果是字符串，尝试转为日期对象
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'));
  }

  // 如果是时间戳（数字），转为日期对象
  if (typeof date === 'number') {
    date = new Date(date);
  }

  if (!(date instanceof Date)) return '';

  const now = new Date();
  const diff = now.getTime() - date.getTime(); // 时间差（毫秒）

  if (diff < 0) {
    return formatDate(date);
  }

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;

  if (diff < minute) {
    return '刚刚';
  } if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } if (diff < month) {
    return `${Math.floor(diff / day)}天前`;
  } if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  }
  return `${Math.floor(diff / year)}年前`;
}

/**
 * 获取日期范围
 * @param {String} type - 范围类型：today, yesterday, week, month, year
 * @returns {Array} 包含开始日期和结束日期的数组
 */
export function getDateRange(type) {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (type) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      // 获取本周的第一天（星期日是0，星期一是1，以此类推）
      const day = start.getDay() || 7; // 如果是周日，getDay()返回0，我们将其视为7
      start.setDate(start.getDate() - day + 1); // 设置为本周一
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + (7 - day));
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1); // 设置为本月第一天
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0); // 设置为本月最后一天
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1); // 设置为本年第一天
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31); // 设置为本年最后一天
      end.setHours(23, 59, 59, 999);
      break;
    default:
      break;
  }

  return [start, end];
}

/**
 * 获取两个日期之间的天数
 * @param {Date|String|Number} startDate - 开始日期
 * @param {Date|String|Number} endDate - 结束日期
 * @returns {Number} 天数
 */
export function getDaysBetween(startDate, endDate) {
  // 转换为日期对象
  if (typeof startDate === 'string') {
    startDate = new Date(startDate.replace(/-/g, '/'));
  }
  if (typeof endDate === 'string') {
    endDate = new Date(endDate.replace(/-/g, '/'));
  }
  if (typeof startDate === 'number') {
    startDate = new Date(startDate);
  }
  if (typeof endDate === 'number') {
    endDate = new Date(endDate);
  }

  // 重置时间部分，只保留日期
  startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  // 计算差值
  const diff = endDate.getTime() - startDate.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
