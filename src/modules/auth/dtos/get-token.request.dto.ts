import { IsString } from 'class-validator';

export class GetTokenRequestDto {
  @IsString()
  email!: string;
}
