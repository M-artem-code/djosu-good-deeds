export const BCRYPT_ROUNDS = 10;
export const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';

/** bcrypt hash of 'dummy-timing-guard' @ BCRYPT_ROUNDS — used when user is missing (constant-time login) */
export const DUMMY_PASSWORD_HASH = '$2b$10$YNvMpqUtCImpbSjk2nDSTe4W3NtvPVq40PjnemolYoOjCFuRq3yqS';
