import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthSession } from './entities/auth.entity';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(AuthSession)
    private readonly authSessionRepository: Repository<AuthSession>,
  ) {}

  async register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string) {
    // 이메일 중복 확인
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // 사용자 생성
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // JWT 토큰 생성
    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    // 세션 저장
    await this.createSession(user.id, accessToken, refreshToken, ipAddress, userAgent);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        timezone: user.timezone,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    // 사용자 찾기
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 마지막 로그인 시간 업데이트
    await this.usersService.updateLastLogin(user.id);

    // JWT 토큰 생성
    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    // 기존 세션 무효화
    await this.invalidateUserSessions(user.id);

    // 새 세션 저장
    await this.createSession(user.id, accessToken, refreshToken, ipAddress, userAgent);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        timezone: user.timezone,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string, token: string) {
    // 세션 삭제
    await this.authSessionRepository.delete({
      user_id: userId,
      token: token,
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      // 리프레시 토큰 검증
      const payload = this.jwtService.verify(refreshToken);
      
      // 세션에서 토큰 확인
      const session = await this.authSessionRepository.findOne({
        where: { refresh_token: refreshToken },
        relations: ['user'],
      });

      if (!session || session.isExpired()) {
        throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
      }

      // 새 토큰 생성
      const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(session.user_id);

      // 세션 업데이트
      session.token = accessToken;
      session.refresh_token = newRefreshToken;
      session.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일
      await this.authSessionRepository.save(session);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }
  }

  async validateToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);
      
      if (!user || !user.is_active) {
        throw new UnauthorizedException('유효하지 않은 사용자입니다.');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  private async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, type: 'access' },
      { expiresIn: '15m' }
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  private async createSession(
    userId: string,
    accessToken: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const session = this.authSessionRepository.create({
      user_id: userId,
      token: accessToken,
      refresh_token: refreshToken,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일
    });

    await this.authSessionRepository.save(session);
  }

  private async invalidateUserSessions(userId: string) {
    await this.authSessionRepository.delete({ user_id: userId });
  }
}
