export interface DtoPropertyError {
  property: string;
  errors: Record<string, string>;
  children: DtoPropertyError[];
}
