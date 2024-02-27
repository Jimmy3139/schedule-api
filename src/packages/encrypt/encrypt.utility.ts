import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptUtility {

  private readonly key = Buffer.from('9F86D081884C7D659A2FEAA0C55AD014A3BF4F1B2B0B822CD15D6C15B0F00A06', 'hex');
  private readonly iv = Buffer.from('D83742D390FB16E8D16A3059D479EABF', 'hex');

  aesEncrypt(plainText: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  aesDecrypt(cipherText: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
    let decrypted = decipher.update(cipherText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  sha256(input: string, salt: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(input + salt);
    return hash.digest('hex');
  }
}
