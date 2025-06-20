import { IsBoolean, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

export class UpdateBookmarkDto {
  @IsUrl({}, { message: 'Must be a valid URL' })
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsUUID()
  @IsOptional()
  folderId?: string | null; // Allow null to move to root

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;
}