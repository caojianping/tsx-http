/***
 * @file:
 * @author: caojianping
 * @Date: 2021-06-04 16:38:32
 */

import axios, { AxiosRequestConfig } from 'axios';
import queryString from 'query-string';

import { isEmptyObject, isIE9, isUndefinedOrNull } from '../utils';
import { REQUEST_TIMEOUT, CANCEL_HTTP_REQUEST } from '../constants';
import { HttpTypeEnum, HttpResponseTypeEnum, HttpContentTypeEnum, HttpMethodEnum } from '../enums';
import { IHttpHandler, ITokenHandler, ILoadingHandler, IResponseHandler, IRequestHandler } from '../interfaces';

(window as any)[CANCEL_HTTP_REQUEST] = null;

// 默认选项
const defaultOptions = {
  responseType: HttpResponseTypeEnum.Json,
  timeout: REQUEST_TIMEOUT,
};

/**
 * axios封装类
 */
export class AxiosService implements IHttpHandler {
  // 通用选项
  private commonOptions!: any;

  // 请求处理器接口
  private requestHandler?: IRequestHandler;

  // 响应处理器接口
  private responseHandler?: IResponseHandler;

  // 令牌处理器接口
  private tokenHandler?: ITokenHandler;

  // 加载处理器接口
  private loadingHandler?: ILoadingHandler;

  constructor(
    commonOptions?: any,
    requestHandler?: IRequestHandler,
    responseHandler?: IResponseHandler,
    tokenHandler?: ITokenHandler,
    loadingHandler?: ILoadingHandler
  ) {
    this.commonOptions = Object.assign(defaultOptions, commonOptions || {});
    this.requestHandler = requestHandler;
    this.responseHandler = responseHandler;
    this.tokenHandler = tokenHandler;
    this.loadingHandler = loadingHandler;
  }

  /**
   * 设置Content-Type
   * @param options 参数选项
   * @param contentType 内容类型
   * @returns 新的参数选项
   */
  private _setContentType(options: AxiosRequestConfig, contentType?: HttpContentTypeEnum): void {
    if (!contentType) return;

    if (!options['headers']) {
      options['headers'] = {};
    }
    options['headers']['Content-Type'] = contentType;
  }

  /**
   * 设置数据
   * @param options 参数选项
   * @param method 请求方法
   * @param contentType 内容类型
   * @param data 请求数据
   * @returns void
   */
  private _setData(
    options: AxiosRequestConfig,
    method: HttpMethodEnum,
    contentType?: HttpContentTypeEnum,
    data?: any
  ): void {
    if (isUndefinedOrNull(data)) return;

    const _isCheck = (value: any) => {
      return typeof value === 'object' && !isEmptyObject(value);
    };

    if (method === HttpMethodEnum.Get) {
      options['params'] = data;
    } else if (method === HttpMethodEnum.Post || method === HttpMethodEnum.Delete) {
      if (contentType === HttpContentTypeEnum.Form) {
        if (_isCheck(data)) {
          options['data'] = queryString.stringify(data);
        }
      } else if (contentType === HttpContentTypeEnum.Json) {
        if (_isCheck(data)) {
          options['data'] = data;
        }
      } else {
        options['data'] = data;
      }
    } else {
      options['data'] = data;
    }
  }

  /**
   * 设置基础选项
   * @param options 参数选项
   * @param url 请求地址
   * @param method 请求方法
   * @param contentType 内容类型
   * @param data 请求数据
   */
  private _setBasicOptions(
    options: AxiosRequestConfig,
    url: string,
    method: HttpMethodEnum,
    contentType?: HttpContentTypeEnum,
    data?: any
  ): void {
    options['url'] = url;
    options['method'] = method as any;
    this._setContentType(options, contentType);
    this._setData(options, method, contentType, data);
  }

  /**
   * 设置CancelToken
   * @param options 参数选项
   */
  private _setCancelToken(options: AxiosRequestConfig): void {
    options.cancelToken = new axios.CancelToken((cancel: any) => {
      (window as any)[CANCEL_HTTP_REQUEST] = cancel;
    });
  }

  /**
   * 设置请求
   * @param options 参数选项
   */
  private _setRequest(options: AxiosRequestConfig): void {
    if (!this.requestHandler) return;

    const handleRequest = this.requestHandler.handleRequest;
    handleRequest && handleRequest.call(this, options);
  }

  /**
   * 设置Authorization
   * @param options 参数选项
   * @param type http类型枚举
   * @returns void
   */
  private _setAuthorization(options: AxiosRequestConfig, type: HttpTypeEnum): void {
    if (!this.tokenHandler) return;

    if (type === HttpTypeEnum.Token || type === HttpTypeEnum.TokenLoading) {
      const getToken = this.tokenHandler.getToken;
      getToken && getToken.call(this, options);
    }
  }

  /**
   * 设置Loading
   * @param type http类型枚举
   * @param isShow 是否显示loading
   * @returns void
   */
  private _setLoading(type: HttpTypeEnum, isShow: boolean): void {
    if (!this.loadingHandler) return;

    if (type === HttpTypeEnum.Loading || type === HttpTypeEnum.TokenLoading) {
      const { showLoading, hideLoading } = this.loadingHandler;
      if (isShow) {
        showLoading && showLoading();
      } else {
        hideLoading && hideLoading();
      }
    }
  }

  /**
   * axios调用
   * @param options 参数选项
   * @param type http类型枚举
   * @returns Promise<T>
   */
  public async invoke<T>(options: AxiosRequestConfig = {}, type: HttpTypeEnum = HttpTypeEnum.Default): Promise<T> {
    if (!options['headers']) {
      options['headers'] = {};
    }

    this._setCancelToken(options);
    this._setRequest(options);
    this._setAuthorization(options, type);

    // 创建axios实例
    const instance = axios.create(this.commonOptions);
    // 处理请求拦截器
    instance.interceptors.request.use(
      (request: any) => {
        this._setLoading(type, true);
        // JSON格式IE9兼容处理
        if (isIE9() && options.method === HttpMethodEnum.Post) {
          request.data = JSON.stringify(request.data);
        }
        return request;
      },
      (err: any) => {
        this._setLoading(type, false);
        return Promise.reject(err);
      }
    );

    // 处理响应拦截器
    instance.interceptors.response.use(
      (response: any) => {
        // JSON格式IE9兼容处理
        if (isIE9()) {
          const request = response.request;
          if (request && request.responseType === HttpResponseTypeEnum.Json && request.responseText) {
            response.data = JSON.parse(request.responseText);
          }
        }
        this._setLoading(type, false);
        return response;
      },
      (err: any) => {
        this._setLoading(type, false);
        return Promise.reject(err);
      }
    );

    // axios调用、处理响应数据
    const response = await instance.request(options);
    if (response.status !== 200) {
      return Promise.reject('Exceptional data');
    }

    // 文件下载特殊处理
    if (options.responseType === 'blob') {
      return response.data;
    }

    // handler: 响应数据定制化
    const result = response.data;
    if (!this.responseHandler || !this.responseHandler.handleResponse) {
      return result as T;
    }

    return this.responseHandler.handleResponse(result, this.tokenHandler?.clearToken);
  }

  /**
   * 【GET方法】
   * @param url 请求地址
   * @param data 请求数据
   * @param type http类型枚举
   * @returns Promise<T>
   */
  public async get<T>(url: string, data?: any, type: HttpTypeEnum = HttpTypeEnum.Default): Promise<T> {
    const options: AxiosRequestConfig = {};
    this._setBasicOptions(options, url, HttpMethodEnum.Get, HttpContentTypeEnum.Form, data);
    return await this.invoke<T>(options, type);
  }

  /**
   * 【POST方法】：表单方式
   * @param url 请求地址
   * @param data 请求数据
   * @param type http类型枚举
   * @returns Promise<T>
   */
  public async post<T>(url: string, data?: any, type: HttpTypeEnum = HttpTypeEnum.Default): Promise<T> {
    const options: AxiosRequestConfig = {};
    this._setBasicOptions(options, url, HttpMethodEnum.Post, HttpContentTypeEnum.Form, data);
    return await this.invoke<T>(options, type);
  }

  /**
   * 【POST方法】：JSON方式
   * @param url 请求地址
   * @param data 请求数据
   * @param type http类型枚举
   * @returns Promise<T>
   */
  public async postJson<T>(url: string, data?: any, type: HttpTypeEnum = HttpTypeEnum.Default): Promise<T> {
    const options: AxiosRequestConfig = {};
    this._setBasicOptions(options, url, HttpMethodEnum.Post, HttpContentTypeEnum.Json, data);
    return await this.invoke<T>(options, type);
  }
}
