import { ClassConstructor } from 'class-transformer/types/interfaces/index.js';
import { plainToInstance } from 'class-transformer';

export function mapEntityToDto<T, V>(entity: T, dto: ClassConstructor<V>): V {
  return plainToInstance(dto, entity, { excludeExtraneousValues: true });
}
