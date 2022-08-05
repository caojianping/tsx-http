# tsx-http

http 请求响应方法库，基于 axios、fetch 等实现，同时暴露 IRequestHandler、IResponseHandler、ITokenHandler、ILoadingHandler 接口实现定制化需求。

## 安装

Using npm:

```bash
$ npm install tsx-http
```

## API

1、相关接口

```ts
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
```

2、相关枚举

```ts
/**
 * 【HTTP】实例类型枚举
 */
export enum HttpInstanceTypeEnum {
  Axios = 0, // 基于axios实现
  Fetch = 1, // 基于fetch实现
  Ajax = 2, // 基于jquery ajax实现
}

/**
 * 【HTTP】类型枚举
 */
export enum HttpTypeEnum {
  Default = 0, // 默认
  Token = 1, // token
  Loading = 2, // 加载
  TokenLoading = 3, // token&&加载
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
```

## 示例

1、通过工厂创建指定实现类 axios 或者 fetch，并且实现相关定制化接口；

```ts
import {
  HttpFactory,
  IHttpHandler,
  ITokenHandler,
  ILoadingHandler,
  IResponseHandler,
  HttpInstanceTypeEnum,
} from 'tsx-http';

export class BaseService {
  protected httpInstance: IHttpHandler;

  constructor() {
    const commonOptions: any = {};
    const requestHandler: IRequestHandler = new RequestHandler();
    const responseHandler: IResponseHandler = new ResponseHandler();
    const tokenHandler: ITokenHandler = new TokenHandler();
    const loadingHandler: ILoadingHandler = new LoadingHandler();
    const httpFactory = new HttpFactory(commonOptions, requestHandler, responseHandler, tokenHandler, loadingHandler);
    this.httpInstance = httpFactory.getHttpInstance(HttpInstanceTypeEnum.Axios);
  }
}

// 定制化需求：request处理器实现类
class RequestHandler implements IRequestHandler {
  public handleRequest(options: any): Promise<any> {
    options['custom-field'] = 'hello world';
  }
}

// 定制化需求：response处理器实现类
class ResponseHandler implements IResponseHandler {
  public handleResponse(result: any, clearTokenHandler?: any): Promise<any> {
    if (!result) return Promise.reject('Exceptional data');

    // result: {status,code,data,msg}
    const code = result.code;
    if (code === '0000' && result.status) {
      // 响应成功
      return Promise.resolve(result);
    } else if (code === '1002') {
      // token失效
      clearTokenHandler && clearTokenHandler();
      return Promise.reject('');
    } else {
      return Promise.reject(result.msg);
    }
  }
}

// 定制化需求：token处理器实现类
class TokenHandler implements ITokenHandler {
  public getToken(options: any) {
    const token = 'de3a63efc';
    options['headers']['Authorization'] = token ? `Bearer ${token}` : '';
  }

  public clearToken() {
    // remove token
  }
}

// 定制化需求：loading处理器实现类
class LoadingHandler implements ILoadingHandler {
  public showLoading() {
    // console.log('ILoadingHandler showLoading');
  }

  public hideLoading() {
    // console.log('ILoadingHandler hideLoading');
  }
}
```

2、通过实现类 BaseService 处理各个模块的服务请求；

```ts
export class TestService extends BaseService {
  async testGet(params: any): Promise<string> {
    return await this.httpInstance.get<string>('url', params, HttpTypeEnum.Token);
  }

  async testPost(params: any): Promise<boolean> {
    return await this.httpInstance.post<boolean>('url', params, HttpTypeEnum.Loading);
  }

  async testPost(params: any): Promise<UserModel> {
    return await this.httpInstance.postJson<UserModel>('url', params, HttpTypeEnum.TokenLoading);
  }
}
```
