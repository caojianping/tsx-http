/***
 * @file:
 * @author: caojianping
 * @Date: 2021-06-16 17:42:28
 */

const wnavigator: any = (window as any).navigator || {};

/**
 * 判断是否为IE9
 */
export const isIE9 = (): boolean => {
  const appName = wnavigator.appName || '';
  const appVersion = wnavigator.appVersion || '';

  let version = appVersion.split(';')[1];
  if (!version) {
    return false;
  }

  version = version.replace(/[ ]/g, '').replace('MSIE', '');
  return appName == 'Microsoft Internet Explorer' && parseInt(version) <= 9;
};

/**
 * 判断是否为空对象
 */
export const isEmptyObject = (obj: any): boolean => {
  return obj && JSON.stringify(obj) === '{}';
};

/**
 * 判断是否为undefined或者null
 */
export const isUndefinedOrNull = (obj: any): boolean => {
  return obj === undefined || obj === null;
};
