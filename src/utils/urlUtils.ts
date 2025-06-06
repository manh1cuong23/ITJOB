/**
 * Add the object as a parameter and splice it into the URL
 * @param baseUrl The url that needs to be spliced
 * @param obj parameter object
 * @returns {string} spliced ​​object
 * example:
 * let obj = {a: '3', b: '4'}
 * setObjToUrlParams('www.baidu.com', obj)
 * ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  let url = '';
  for (const key in obj) {
    parameters += `${key}=${encodeURIComponent(obj[key])}&`;
  }
  parameters = parameters.replace(/&$/, '');
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters;
  } else {
    url = baseUrl.replace(/\/?$/, '?') + parameters;
  }
  return url;
}

/**
 * 将路径中重复的正斜杆替换成单个斜杆隔开的字符串
 * @param path 要处理的路径
 * @returns {string} 将/去重后的结果
 */
export const uniqueSlash = (path: string) => path.replace(/(https?:\/)|(\/)+/g, '$1$2');
// Safari 不支持以下正则(反向否定查找) shit!
// export const uniqueSlash = (path: string) => path.replace(/(?<!:)\/{2,}/g, '/');
