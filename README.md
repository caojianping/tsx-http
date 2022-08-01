# @agilines/http

http请求响应方法库，基于axios、fetch等实现，同时暴露ITokenHandler、ILoadingHandler、IResponseHandler接口实现定制化需求。

## 安装

Using npm:

```bash
$ npm install @agilines/http
```

Using yarn:

```bash
$ yarn add @agilines/http
```

## API
1、相关接口
```ts
// http处理器接口
export interface IHttpHandler {
  invoke(options?: any, type?: HttpTypeEnum): Promise<any>;
  get(url: string, data?: any, type?: HttpTypeEnum): Promise<any>;
  post(url: string, data?: any, type?: HttpTypeEnum): Promise<any>;
  postJson(url: string, data?: any, type?: HttpTypeEnum): Promise<any>;
}

// 令牌处理器接口
export interface ITokenHandler {
  getToken: (options: any) => void;
  clearToken: () => void;
}

// 加载处理器接口
export interface ILoadingHandler {
  showLoading: () => void;
  hideLoading: () => void;
}

// 响应处理器接口
export interface IResponseHandler {
  handleResponse(result: any, clearTokenHandler?: any): any;
}
```

2、相关枚举
```ts
//【HTTP】实例类型枚举
export enum HttpInstanceTypeEnum {
  Axios = 0, // 基于axios实现
  Fetch = 1, // 基于fetch实现
  Ajax = 2 // 基于jquery ajax实现
}

// 【HTTP】类型枚举
export enum HttpTypeEnum {
  Default = 0, // 默认
  Token = 1, // token
  Loading = 2, // 加载
  TokenLoading = 3 // token&&加载
}

// 【HTTP】请求方法枚举
export enum HttpMethodEnum {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Head = 'HEAD',
  Delete = 'DELETE',
  Connect = 'CONNECT',
  Options = 'OPTIONS',
  Trace = 'TRACE'
}

// 【HTTP】内容类型枚举
export enum HttpContentTypeEnum {
  Form = 'application/x-www-form-urlencoded; charset=UTF-8',
  Json = 'application/json; charset=UTF-8',
  FormData = 'multipart/form-data'
}

// 【HTTP】响应类型枚举
export enum HttpResponseTypeEnum {
  Xml = 'xml',
  Html = 'html',
  Text = 'text',
  Script = 'script',
  Json = 'json',
  Jsonp = 'jsonp'
}
```

## 示例

1、通过工厂创建指定实现类axios或者fetch，并且实现相关定制化接口；
```ts
import { LocalStorage } from '@agilines/storage';
import {
  HttpFactory,
  IHttpHandler,
  ITokenHandler,
  ILoadingHandler,
  IResponseHandler,
  HttpInstanceTypeEnum,
} from '@packages/http';
import { TOKEN } from '../constants';

export class BaseService {
  protected httpInstance: IHttpHandler;

  constructor() {
    const commonOptions: any = {};
    const tokenHandler: ITokenHandler = new TokenHandler();
    const loadingHandler: ILoadingHandler = new LoadingHandler();
    const responseHandler: IResponseHandler = new ResponseHandler();
    const httpFactory = new HttpFactory(commonOptions, tokenHandler, loadingHandler, responseHandler);
    this.httpInstance = httpFactory.getHttpInstance(HttpInstanceTypeEnum.Axios);// 工厂创建指定实现类axios或者fetch
  }
}

// 定制化需求：token处理器实现类
class TokenHandler implements ITokenHandler {
  public getToken(options: any) {
    const token = localStorage.getItem(TOKEN);
    options['headers']['Authorization'] = token ? `Bearer ${token}` : '';
  }

  public clearToken() {
    LocalStorage.removeItem(TOKEN);
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

// 定制化需求：response处理器实现类
class ResponseHandler implements IResponseHandler {
  public handleResponse(result: any, clearTokenHandler?: any): Promise<any> {
    if (!result) {
      return Promise.reject('Exceptional data');
    }

    const code = result.code;
    if (code === '0000' && result.status) {
      return Promise.resolve(result);
    } else if (code === '1002') {
      clearTokenHandler && clearTokenHandler();
      return Promise.reject('');
    } else {
      return Promise.reject(result.messages);
    }
  }
}
```

2、通过实现类BaseService处理各个模块的ajax请求；
```ts
import { HttpTypeEnum } from '@packages/http';
import { BaseService } from './base.service';

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
