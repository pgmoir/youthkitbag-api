import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  echo(): string {
    return 'Echo!';
  }
}
