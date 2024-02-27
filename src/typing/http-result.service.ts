import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RespBody } from './response';


@Injectable()
export class HttpResultService {
  handle<T>(resp: RespBody<T>) {
    switch (resp.code) {
      case HttpStatus.OK:
        return resp; // 正常返回整個 resp 物件
      case HttpStatus.CREATED:
        throw new HttpException(resp, HttpStatus.CREATED);
      case HttpStatus.BAD_REQUEST:
        throw new HttpException(resp, HttpStatus.BAD_REQUEST);
      case HttpStatus.UNAUTHORIZED:
        throw new HttpException(resp, HttpStatus.UNAUTHORIZED);
      case HttpStatus.NOT_FOUND:
        throw new HttpException(resp, HttpStatus.NOT_FOUND);
      default:
        throw new HttpException(resp, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
