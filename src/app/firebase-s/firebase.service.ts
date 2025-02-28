import { Injectable } from '@nestjs/common';
import admin from 'src/utils/firebase';

@Injectable()
export class FirebaseService {
  constructor(private readonly firebaseAdmin = admin) {}

  async checkUserExistsByEmail(email: string): Promise<boolean> {
    try {
      const userRecord = await this.firebaseAdmin.auth().getUserByEmail(email);
      return !!userRecord;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return false;
      }
      throw error;
    }
  }
}
