import { DtoPropertyError } from '../dto-errors/dto-property-error.interface';

export interface InvalidArgumentsPayload {
  errors: DtoPropertyError[];
}
