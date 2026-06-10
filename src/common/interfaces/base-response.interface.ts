export interface BaseResponse<T> {
  message?: string;
  data?: T;
  error?: Object;
}
