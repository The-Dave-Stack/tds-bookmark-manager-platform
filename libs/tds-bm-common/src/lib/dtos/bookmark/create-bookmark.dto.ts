import { IsNotEmpty, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateBookmarkDto {
  @IsUrl({}, { message: 'Must be a valid URL' })
  @IsNotEmpty({ message: 'URL is required' })
  url!: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsUUID()
  @IsOptional()
  folderId?: string;
}