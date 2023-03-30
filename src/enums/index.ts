/***
 * @file:
 * @author: caojianping
 * @Date: 2021-06-02 17:29:36
 */

/**
 * 【HTTP】实例类型枚举
 */
export enum HttpInstanceTypeEnum {
  // 基于axios实现
  Axios = 0,

  // 基于fetch实现
  Fetch = 1,

  // 基于jquery ajax实现
  Ajax = 2,
}

/**
 * 【HTTP】类型枚举
 */
export enum HttpTypeEnum {
  // 默认
  Default = 0,

  // token
  Token = 1,

  // 加载
  Loading = 2,

  // token&&加载
  TokenLoading = 3,
}

/**
 * 【HTTP】请求方法枚举
 */
export enum HttpMethodEnum {
  // get
  Get = 'GET',

  // post
  Post = 'POST',

  // put
  Put = 'PUT',

  // head
  Head = 'HEAD',

  // delete
  Delete = 'DELETE',

  // connect
  Connect = 'CONNECT',

  // options
  Options = 'OPTIONS',

  // trace
  Trace = 'TRACE',
}

/**
 * 【HTTP】内容类型枚举
 */
export enum HttpContentTypeEnum {
  // form
  Form = 'application/x-www-form-urlencoded; charset=UTF-8',

  // json
  Json = 'application/json; charset=UTF-8',

  // formData
  FormData = 'multipart/form-data',
}

/**
 * 【HTTP】响应类型枚举
 */
export enum HttpResponseTypeEnum {
  // xml
  Xml = 'xml',

  // html
  Html = 'html',

  // text
  Text = 'text',

  // script
  Script = 'script',

  // json
  Json = 'json',

  // jsonp
  Jsonp = 'jsonp',
}
