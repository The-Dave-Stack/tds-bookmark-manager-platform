/**
 * mapper.utils.ts
 *
 * Purpose:
 * - Provides utility functions for data mapping (entity to DTO) and email validation.
 *
 * Logic Overview:
 * - Contains helper functions to transform data between different formats and validate common data types.
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { ClassConstructor } from 'class-transformer/types/interfaces/index.js';
import { plainToInstance } from 'class-transformer';

/**
 * Maps a database entity object to a Data Transfer Object (DTO) instance.
 * It uses `class-transformer` to convert a plain object (entity) into an instance
 * of the specified DTO class, excluding extraneous values.
 *
 * @template T The type of the source entity.
 * @template V The type of the target DTO.
 * @param {T} entity The source entity object to be mapped.
 * @param {ClassConstructor<V>} dto The constructor of the target DTO class.
 * @returns {V} An instance of the DTO with mapped values.
 */
export function mapEntityToDto<T, V>(entity: T, dto: ClassConstructor<V>): V {
  return plainToInstance(dto, entity, { excludeExtraneousValues: true });
}

/**
 * Validates if a given string is a valid email address using a regular expression.
 *
 * @param {string} value The string to validate as an email.
 * @returns {boolean} `true` if the string is a valid email.
 * @throws {Error} Throws an error with message 'Invalid email format' if the email is not valid.
 */
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const result = emailRegex.test(value);
  if (!result) {
    throw new Error('Invalid email format');
  }
  return result;
}
