import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUUID()
  @IsOptional()
  parentId?: string | null;
}