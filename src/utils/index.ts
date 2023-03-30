/***
 * @file:
 * @author: caojianping
 * @Date: 2021-06-16 17:42:28
 */

const wnavigator: any = (window as any).navigator || {};

/**
 * 判断是否为IE9
 * @returns 返回判断结果
 */
export const isIE9 = (): boolean => {
  const appName = wnavigator.appName || '';
  const appVersion = wnavigator.appVersion || '';

  let version = appVersion.split(';')[1];
  if (!version) return false;

  version = version.replace(/[ ]/g, '').replace('MSIE', '');
  return appName == 'Microsoft Internet Explorer' && parseInt(version) <= 9;
};

/**
 * 判断是否为空对象
 * @param obj 对象
 * @returns 返回判断结果
 */
export const isEmptyObject = (obj: any): boolean => {
  return obj && JSON.stringify(obj) === '{}';
};

/**
 * 判断数据是否为Undefined或者Null
 * @param data 数据
 * @returns 返回判断结果
 */
export function isUndefinedOrNull(data: any): boolean {
  return (
    Object.prototype.toString.call(data) === '[object Undefined]' ||
    Object.prototype.toString.call(data) === '[object Null]'
  );
}
