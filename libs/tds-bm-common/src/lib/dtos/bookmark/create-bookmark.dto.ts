import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateBookmarkDto {
  @IsUrl({}, { message: 'Must be a valid URL' })
  @IsNotEmpty({ message: 'URL is required' })
  url!: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsUrl({}, { message: 'Must be a valid URL' })
  @IsOptional()
  faviconUrl?: string; // Optional, no validation needed

  @IsUUID()
  @IsOptional()
  folderId?: string;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;
}