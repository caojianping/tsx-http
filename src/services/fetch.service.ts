/***
 * @file:
 * @author: caojianping
 * @Date: 2021-06-04 16:38:11
 */

import { HttpTypeEnum } from '../enums';
import { IHttpHandler, ILoadingHandler, IRequestHandler, IResponseHandler, ITokenHandler } from '../interfaces';

/**
 * fetch封装类
 */
export class FetchService implements IHttpHandler {
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
    this.commonOptions = Object.assign({}, commonOptions || {});
    this.requestHandler = requestHandler;
    this.responseHandler = responseHandler;
    this.tokenHandler = tokenHandler;
    this.loadingHandler = loadingHandler;
    console.log(
      'opt,req,res,token,load:',
      this.commonOptions,
      this.requestHandler,
      this.responseHandler,
      this.tokenHandler,
      this.loadingHandler
    );
  }

  /**
   * fetch调用
   * @param options 参数选项
   * @param type http类型枚举
   * @returns Promise<T>
   */
  public async invoke<T>(options: any = {}, type: HttpTypeEnum = HttpTypeEnum.Default): Promise<T> {
    console.log('Cfetch.invoke options,type:', options, type);
    return {} as T;
  }

  /**
   * 【GET方法】
   * @param url 请求地址
   * @param data 请求数据
   * @param type http类型枚举
   * @returns Promise<T>
   */
  public async get<T>(url: string, data: any = {}, type: HttpTypeEnum = HttpTypeEnum.Default): Promise<T> {
    console.log('Cfetch.get url,data,type:', url, data, type);
    return {} as T;
  }

  /**
   * 【POST方法】：表单方式
   * @param url 请求地址
   * @param data 请求数据
   * @param type http类型枚举
   * @returns Promise<T>
   */
  public async post<T>(url: string, data: any = {}, type: HttpTypeEnum = HttpTypeEnum.Default): Promise<T> {
    console.log('Cfetch.post url,data,type:', url, data, type);
    return {} as T;
  }

  /**
   * 【POST方法】：JSON方式
   * @param url 请求地址
   * @param data 请求数据
   * @param type http类型枚举
   * @returns Promise<T>
   */
  public async postJson<T>(url: string, data: any = {}, type: HttpTypeEnum = HttpTypeEnum.Default): Promise<T> {
    console.log('Cfetch.postJson url,data,type:', url, data, type);
    return {} as T;
  }
}
