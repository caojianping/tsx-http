/***
 * @file:
 * @author: caojianping
 * @Date: 2022-08-01 17:38:43
 */

import { HttpInstanceTypeEnum } from '../enums';
import { IHttpHandler, ILoadingHandler, IResponseHandler, ITokenHandler, IRequestHandler } from '../interfaces';
import { Caxios } from '../../caxios';
import { Cfetch } from '../../cfetch';

/**
 * http工厂类
 */
export class HttpFactory {
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
    this.commonOptions = commonOptions;
    this.requestHandler = requestHandler;
    this.responseHandler = responseHandler;
    this.tokenHandler = tokenHandler;
    this.loadingHandler = loadingHandler;
  }

  /**
   * 获取http实例
   * @param instanceType 实例类型
   * @returns IHttpHandler
   */
  public getHttpInstance(instanceType: HttpInstanceTypeEnum = HttpInstanceTypeEnum.Axios): IHttpHandler {
    let result: IHttpHandler;
    switch (instanceType) {
      case HttpInstanceTypeEnum.Axios:
        result = new Caxios(
          this.commonOptions,
          this.requestHandler,
          this.responseHandler,
          this.tokenHandler,
          this.loadingHandler
        );
        break;
      case HttpInstanceTypeEnum.Fetch:
        result = new Cfetch(
          this.commonOptions,
          this.requestHandler,
          this.responseHandler,
          this.tokenHandler,
          this.loadingHandler
        );
        break;
      case HttpInstanceTypeEnum.Ajax:
        result = new Caxios(this.commonOptions);
        break;
    }
    return result;
  }
}
