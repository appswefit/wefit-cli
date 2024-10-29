import { Buffer } from 'node:buffer';
import { MESSAGES_NPM_CREDENTIALS } from '../constants';

/**
 * Converte uma string de senha em uma string base64.
 *
 * @param {string} password - A senha a ser convertida.
 * @returns {string} A senha convertida em base64.
 */
export const convertPasswordToBase64 = (password: string): string => {
  if (!password) {
    throw new Error(MESSAGES_NPM_CREDENTIALS.error.invalidPasswordError());
  }

  const trimmedPassword = password.trim();
  const passwordBuffer = Buffer.from(trimmedPassword, 'utf-8');
  const base64Password = passwordBuffer.toString('base64');

  return base64Password;
};