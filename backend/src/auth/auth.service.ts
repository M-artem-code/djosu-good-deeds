import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  DUMMY_PASSWORD_HASH,
  INVALID_CREDENTIALS_MESSAGE,
} from './constants/auth.constants';
import { toPublicUser } from '../common/utils/to-public-user';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordService } from './password.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      displayName: dto.displayName,
      tag: dto.tag,
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    const valid = await this.passwordService.compare(
      dto.password,
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
    );

    if (!user || !valid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return this.buildAuthResponse(user);
  }

  private signToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }

  private buildAuthResponse(user: UserDocument): AuthResponseDto {
    return {
      accessToken: this.signToken(user._id.toString()),
      user: toPublicUser(user),
    };
  }
}
