import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  healthCheckUp(): string {
    return 'Muse backend is running!';
  }
}
