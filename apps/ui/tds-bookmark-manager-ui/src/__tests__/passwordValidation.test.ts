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