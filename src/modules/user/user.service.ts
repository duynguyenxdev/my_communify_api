import { Injectable } from '@nestjs/common';
import { ILike, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from './dtos/user.response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getByRefId(refId: string) {
    return this.userRepository.findOneBy({ refId: refId });
  }

  async getById(id: string) {
    try {
      return await this.userRepository.findOneBy({ id: id });
    } catch (error) {
      return null;
    }
  }

  getByEmail(email: string) {
    return this.userRepository.findOneBy({ email: email });
  }

  async search(userId: string, query: string): Promise<UserResponseDto[]> {
    if (!query) return [];

    const users = await this.userRepository.find({
      where: {
        email: ILike(`${query}%`),
        id: Not(userId),
      },
    });

    const userDtos: UserResponseDto[] = users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    }));

    return userDtos;
  }

  create(user: User) {
    return this.userRepository.save(user);
  }
}
