import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateKitbagDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsArray()
  @IsOptional()
  readonly activitys?: string[];
}
