import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['subscriptions', 'transactions', 'alerts', 'savings'],
    });
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['subscriptions', 'transactions', 'alerts', 'savings'],
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['subscriptions', 'transactions', 'alerts', 'savings'],
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      select: ['id', 'email', 'password', 'name', 'timezone', 'is_active', 'email_verified', 'last_login_at', 'created_at', 'updated_at'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // 이메일 변경 시 중복 확인
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {
      last_login_at: new Date(),
    });
  }

  async getUserStats(id: string) {
    const user = await this.findOne(id);
    
    return {
      subscriptionCount: user.subscriptionCount,
      monthlySpending: user.monthlySpending,
      yearlySpending: user.yearlySpending,
      totalSpending: user.totalSpending,
      totalSavings: user.savings?.reduce((sum, saving) => sum + saving.amount, 0) || 0,
      activeAlerts: user.alerts?.filter(alert => !alert.read_at).length || 0,
    };
  }
}
