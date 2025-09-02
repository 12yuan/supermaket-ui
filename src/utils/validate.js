/**
 * 表单验证工具
 */

/**
 * 验证是否为外部链接
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 验证用户名
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const validMap = ['admin', 'editor'];
  return validMap.indexOf(str.trim()) >= 0;
}

/**
 * 验证URL
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/**
 * 验证小写字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/**
 * 验证大写字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/**
 * 验证是否为字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * 验证邮箱
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}

/**
 * 验证手机号码
 * @param {string} phone
 * @returns {Boolean}
 */
export function validPhone(phone) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
}

/**
 * 验证身份证号码
 * @param {string} idCard
 * @returns {Boolean}
 */
export function validIDCard(idCard) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(idCard);
}

/**
 * 验证密码强度
 * 至少包含大小写字母、数字和特殊字符，长度8-20
 * @param {string} password
 * @returns {Boolean}
 */
export function validPasswordStrength(password) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/;
  return reg.test(password);
}

/**
 * 验证是否为数字
 * @param {string} str
 * @returns {Boolean}
 */
export function validNumber(str) {
  const reg = /^[0-9]+$/;
  return reg.test(str);
}

/**
 * 验证是否为整数
 * @param {string} str
 * @returns {Boolean}
 */
export function validInteger(str) {
  const reg = /^-?\d+$/;
  return reg.test(str);
}

/**
 * 验证是否为正整数
 * @param {string} str
 * @returns {Boolean}
 */
export function validPositiveInteger(str) {
  const reg = /^\d+$/;
  return reg.test(str);
}

/**
 * 验证是否为浮点数
 * @param {string} str
 * @returns {Boolean}
 */
export function validFloat(str) {
  const reg = /^(-?\d+)(\.\d+)?$/;
  return reg.test(str);
}

/**
 * 验证是否为中文
 * @param {string} str
 * @returns {Boolean}
 */
export function validChinese(str) {
  const reg = /^[\u4e00-\u9fa5]+$/;
  return reg.test(str);
}

/**
 * 验证邮政编码
 * @param {string} str
 * @returns {Boolean}
 */
export function validPostalCode(str) {
  const reg = /^\d{6}$/;
  return reg.test(str);
}
