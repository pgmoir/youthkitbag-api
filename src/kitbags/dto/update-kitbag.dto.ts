import { PartialType } from '@nestjs/swagger';
import { CreateKitbagDto } from './create-kitbag.dto';

export class UpdateKitbagDto extends PartialType(CreateKitbagDto) {}
