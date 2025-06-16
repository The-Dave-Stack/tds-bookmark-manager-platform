import { ClassConstructor } from 'class-transformer/types/interfaces/index.js';
import { plainToInstance } from 'class-transformer';

export function mapEntityToDto<T, V>(entity: T, dto: ClassConstructor<V>): V {
  return plainToInstance(dto, entity, { excludeExtraneousValues: true });
}

export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const result = emailRegex.test(value);
  if (!result) {
    throw new Error('Invalid email format');
  }
  return result;
}