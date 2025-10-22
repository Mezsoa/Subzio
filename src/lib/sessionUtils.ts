import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

// Use environment variable for encryption key, fallback to a default for development
const getEncryptionKey = (): Buffer => {
  const key = process.env.SESSION_ENCRYPTION_KEY || 'default-dev-key-32-chars-long';
  return Buffer.from(key.padEnd(KEY_LENGTH, '0').slice(0, KEY_LENGTH));
};

export interface SessionState {
  userId: string;
  refreshToken: string;
  timestamp: number;
}

export function encryptSessionState(sessionState: SessionState): string {
  try {
    const key = getEncryptionKey();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    
    const data = JSON.stringify(sessionState);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const tag = cipher.getAuthTag();
    
    // Combine IV, tag, and encrypted data
    const combined = Buffer.concat([iv, tag, Buffer.from(encrypted, 'base64')]);
    return combined.toString('base64');
  } catch (error) {
    throw new Error('Failed to encrypt session state');
  }
}

export function decryptSessionState(encryptedState: string): SessionState | null {
  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(encryptedState, 'base64');
    
    if (combined.length < IV_LENGTH + TAG_LENGTH) {
      return null;
    }
    
    const iv = combined.slice(0, IV_LENGTH);
    const tag = combined.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.slice(IV_LENGTH + TAG_LENGTH);
    
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    
    const sessionState = JSON.parse(decrypted) as SessionState;
    
    // Check if the state is not too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (Date.now() - sessionState.timestamp > maxAge) {
      return null;
    }
    
    return sessionState;
  } catch (error) {
    return null;
  }
}
