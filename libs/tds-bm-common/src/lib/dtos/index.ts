/**
 * index.ts
 *
 * Purpose:
 * - Exports all DTOs from the `dtos` directory for easier import.
 *
 * Logic Overview:
 * - Aggregates DTO exports from various sub-modules (user, auth, bookmark, folder).
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

export * from './user/login-user.dto.js';
export * from './user/create-user.dto.js';
export * from './user/update-user-role.dto.js';
export * from './user/forgot-password.dto.js';
export * from './user/reset-password.dto.js';
export * from './auth/jwtpayload.dto.js';
export * from './auth/token.dto.js';
export * from './bookmark/create-bookmark.dto.js';
export * from './bookmark/update-bookmark.dto.js';
export * from './folder/create-folder.dto.js';
export * from './folder/update-folder.dto.js';
