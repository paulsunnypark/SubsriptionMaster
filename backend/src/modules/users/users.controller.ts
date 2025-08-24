import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '사용자 생성' })
  @ApiResponse({ status: 201, description: '사용자가 성공적으로 생성되었습니다.', type: User })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일입니다.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모든 사용자 조회' })
  @ApiResponse({ status: 200, description: '사용자 목록을 반환합니다.', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '현재 사용자 프로필 조회' })
  @ApiResponse({ status: 200, description: '현재 사용자 정보를 반환합니다.', type: User })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('profile/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '현재 사용자 통계 조회' })
  @ApiResponse({ status: 200, description: '사용자 통계를 반환합니다.' })
  getUserStats(@Request() req) {
    return this.usersService.getUserStats(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 ID로 조회' })
  @ApiResponse({ status: 200, description: '사용자 정보를 반환합니다.', type: User })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiResponse({ status: 200, description: '사용자 정보가 성공적으로 수정되었습니다.', type: User })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일입니다.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '현재 사용자 프로필 수정' })
  @ApiResponse({ status: 200, description: '프로필이 성공적으로 수정되었습니다.', type: User })
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({ status: 200, description: '사용자가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
