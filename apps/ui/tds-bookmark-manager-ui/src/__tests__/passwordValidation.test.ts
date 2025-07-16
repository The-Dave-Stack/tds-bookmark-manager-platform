/**
 * passwordValidation.test.ts
 *
 * Purpose:
 * - Unit tests for the `validatePassword` utility function.
 * - Ensures that password validation rules are correctly applied.
 *
 * Logic Overview:
 * 1. Imports the `validatePassword` function from `../utils/passwordValidation`.
 * 2. Defines a series of test cases to cover different password scenarios:
 *    - A strong password that meets all requirements.
 *    - Passwords failing specific requirements (uppercase, lowercase, number, special character, minimum length).
 * 3. For each test case, it calls `validatePassword` and asserts the `isValid` status and the individual `requirements` flags.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { describe, it, expect } from 'vitest';

import { validatePassword } from '../utils/passwordValidation';

describe('Password Validation', () => {
  it('should validate a strong password', () => {
    const password = 'StrongP@ss123';
    const result = validatePassword(password);
    
    expect(result.isValid).toBe(true);
    expect(result.requirements).toEqual({
      minLength: true,
      uppercase: true,
      lowercase: true,
      number: true,
      special: true
    });
  });

  it('should fail for password without uppercase', () => {
    const password = 'weakp@ss123';
    const result = validatePassword(password);
    
    expect(result.isValid).toBe(false);
    expect(result.requirements.uppercase).toBe(false);
  });

  it('should fail for password without lowercase', () => {
    const password = 'STRONGP@SS123';
    const result = validatePassword(password);
    
    expect(result.isValid).toBe(false);
    expect(result.requirements.lowercase).toBe(false);
  });

  it('should fail for password without numbers', () => {
    const password = 'StrongP@ssword';
    const result = validatePassword(password);
    
    expect(result.isValid).toBe(false);
    expect(result.requirements.number).toBe(false);
  });

  it('should fail for password without special characters', () => {
    const password = 'StrongPass123';
    const result = validatePassword(password);
    
    expect(result.isValid).toBe(false);
    expect(result.requirements.special).toBe(false);
  });

  it('should fail for short password', () => {
    const password = 'Sh@rt1';
    const result = validatePassword(password);
    
    expect(result.isValid).toBe(false);
    expect(result.requirements.minLength).toBe(false);
  });
});
