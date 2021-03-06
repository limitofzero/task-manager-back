import { ApiException } from './api.exception';
import { Exceptions } from './exceptions.enum';
import { InvalidArgumentsPayload } from './invalid-arguments-payload.interface';

export class InvalidArgumentsException extends ApiException<InvalidArgumentsPayload> {
  constructor(payload: InvalidArgumentsPayload) {
    super(Exceptions.InvalidArgs, payload);
  }
}
