import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MagicLink, MagicLinkDocument } from 'src/schemas';
import { ENCRYPTION_CONFIG } from 'src/utils/magic-link/encryption.constants';
import { v4 as uuIdv4 } from 'uuid';
import {
  randomBytes,
  createCipheriv,
  CipherGCM,
  createDecipheriv,
  DecipherGCM,
} from 'node:crypto';

@Injectable()
export class MagicLinkService {
  constructor(
    @InjectModel(MagicLink.name)
    private readonly magicLinkModel: Model<MagicLinkDocument>,
  ) {}

  async create(email: string): Promise<string> {
    try {
      // Generate unique ID and expiration
      const id = uuIdv4();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Create encryption components
      const iv = randomBytes(ENCRYPTION_CONFIG.ivLength);
      const key = Buffer.from(ENCRYPTION_CONFIG.key, 'base64');

      // Encrypt payload
      const cipher = createCipheriv(
        ENCRYPTION_CONFIG.algorithm,
        key,
        iv,
      ) as CipherGCM;
      const payload = JSON.stringify({ email, id });
      let encrypted = cipher.update(payload, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag();

      // Create token
      const token = Buffer.from(
        iv.toString('hex') + encrypted + authTag.toString('hex'),
      ).toString('base64url');

      // Store in database
      await this.magicLinkModel.create({
        uniqueId: id,
        email,
        expiration: expiresAt,
      });
      return token;
    } catch (error: any) {
      return error;
    }
  }

  async validateMagicLink(token: string): Promise<string> {
    const buffer = Buffer.from(token, 'base64url');
    const tokenString = buffer.toString('utf-8');

    const iv = Buffer.from(tokenString.substring(0, 24), 'hex');
    const encrypted = tokenString.substring(24, tokenString.length - 32);
    const authTag = Buffer.from(
      tokenString.substring(tokenString.length - 32),
      'hex',
    );

    const key = Buffer.from(ENCRYPTION_CONFIG.key, 'base64');
    const decipher = createDecipheriv(
      ENCRYPTION_CONFIG.algorithm,
      key,
      iv,
    ) as DecipherGCM;
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const { email, id } = JSON.parse(decrypted);

    const magicLink = await this.magicLinkModel.findOne({ uniqueId: id });
    if (!magicLink)
      throw new HttpException('Invalid token', HttpStatus.NOT_FOUND);
    if (magicLink.isOpen)
      throw new HttpException(
        'This link is already used. Please try to create a new link',
        HttpStatus.NOT_ACCEPTABLE,
      );
    if (magicLink.expiration < new Date())
      throw new HttpException(
        'This Link expired. Please try to create a new link',
        HttpStatus.NOT_ACCEPTABLE,
      );

    return email;
  }

  updateMagicLink(email: string) {
    return this.magicLinkModel.updateOne({ email }, { isOpen: true });
  }
}
