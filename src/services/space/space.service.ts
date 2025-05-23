import { Injectable } from '@nestjs/common';

@Injectable()
export class SpaceService {
  convert(value: string): string {
    return value.replace(/\s/g, '');
  }
}
