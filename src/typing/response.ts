 export class RespBody<T> {
  isSuccess: boolean;
  code: number;
  message?: string;
  data?: T;

  constructor(init: { isSuccess: boolean, code: number, message?: string, data?: T }) {
    this.isSuccess = init.isSuccess;
    this.code = init.code;
    this.message = init.message;
    this.data = init.data;
  }
}

