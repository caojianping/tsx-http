/***
 * @file:
 * @author: caojianping
 * @Date: 2021-06-03 15:57:14
 */

import { HttpTypeEnum } from '../enums';

/**
 * http处理器接口
 */
export interface IHttpHandler {
  invoke<T>(options?: any, type?: HttpTypeEnum): Promise<T>;
  get<T>(url: string, data?: any, type?: HttpTypeEnum): Promise<T>;
  post<T>(url: string, data?: any, type?: HttpTypeEnum): Promise<T>;
  postJson<T>(url: string, data?: any, type?: HttpTypeEnum): Promise<T>;
}

/**
 * 请求处理器接口
 */
export interface IRequestHandler {
  handleRequest(options: any): void;
}

/**
 * 响应处理器接口
 */
export interface IResponseHandler {
  handleResponse(result: any, clearTokenHandler?: any): any;
}

/**
 * 令牌处理器接口
 */
export interface ITokenHandler {
  getToken: (options: any) => void;
  clearToken: () => void;
}

/**
 * 加载处理器接口
 */
export interface ILoadingHandler {
  showLoading: () => void;
  hideLoading: () => void;
}
