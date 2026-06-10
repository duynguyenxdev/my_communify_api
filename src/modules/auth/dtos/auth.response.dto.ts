import { UserResponseDto } from '@/modules/user/dtos/user.response.dto';

export class AuthResponseDto {
  accessToken!: string;
  user!: UserResponseDto;
}
