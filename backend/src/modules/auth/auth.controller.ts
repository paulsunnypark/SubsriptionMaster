import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '사용자 회원가입' })
  @ApiResponse({ status: 201, description: '회원가입이 성공적으로 완료되었습니다.' })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일입니다.' })
  async register(
    @Body() registerDto: RegisterDto,
    @Request() req,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    return await this.authService.register(registerDto, ipAddress, userAgent);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '사용자 로그인' })
  @ApiResponse({ status: 200, description: '로그인이 성공적으로 완료되었습니다.' })
  @ApiResponse({ status: 401, description: '이메일 또는 비밀번호가 올바르지 않습니다.' })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    return await this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '사용자 로그아웃' })
  @ApiResponse({ status: 200, description: '로그아웃이 성공적으로 완료되었습니다.' })
  async logout(@Request() req) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    await this.authService.logout(req.user.id, token);
    return { message: '로그아웃되었습니다.' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiResponse({ status: 200, description: '토큰이 성공적으로 갱신되었습니다.' })
  @ApiResponse({ status: 401, description: '유효하지 않은 리프레시 토큰입니다.' })
  async refreshToken(@Body() body: { refreshToken: string }) {
    return await this.authService.refreshToken(body.refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '현재 사용자 프로필 조회' })
  @ApiResponse({ status: 200, description: '사용자 프로필을 반환합니다.' })
  async getProfile(@Request() req) {
    return req.user;
  }
}
