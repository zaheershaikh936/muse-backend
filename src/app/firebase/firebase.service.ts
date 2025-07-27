import { Injectable } from '@nestjs/common';
import admin from 'src/utils/firebase';

@Injectable()
export class FirebaseService {
  async firebaseUserIsExist(email: string): Promise<boolean> {
    const user = await admin.auth().getUserByEmail(email);
    if (!user) throw new Error('Something went wrong, the user does not exist');
    return true;
  }
}
