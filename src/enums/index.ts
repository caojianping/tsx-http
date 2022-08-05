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
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Head = 'HEAD',
  Delete = 'DELETE',
  Connect = 'CONNECT',
  Options = 'OPTIONS',
  Trace = 'TRACE',
}

/**
 * 【HTTP】内容类型枚举
 */
export enum HttpContentTypeEnum {
  Form = 'application/x-www-form-urlencoded; charset=UTF-8',
  Json = 'application/json; charset=UTF-8',
  FormData = 'multipart/form-data',
}

/**
 * 【HTTP】响应类型枚举
 */
export enum HttpResponseTypeEnum {
  Xml = 'xml',
  Html = 'html',
  Text = 'text',
  Script = 'script',
  Json = 'json',
  Jsonp = 'jsonp',
}
