import { Exceptions } from './exceptions.enum';

export interface BadRequest<T> {
  code: Exceptions;
  payload: T;
}
