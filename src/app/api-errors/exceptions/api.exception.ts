import { BadRequestException } from '@nestjs/common';

import { Exceptions } from './exceptions.enum';

export class ApiException<T> extends BadRequestException {
  constructor(code: Exceptions, payload: T) {
    super({
      code,
      payload,
    });
  }

  public getResponse(): { code: Exceptions; payload: T } {
    return super.getResponse() as { code: Exceptions; payload: T };
  }
}
