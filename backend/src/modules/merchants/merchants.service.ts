import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from './entities/merchant.entity';
import { NormalizationRule } from './entities/normalization-rule.entity';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { CreateNormalizationRuleDto } from './dto/create-normalization-rule.dto';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(NormalizationRule)
    private readonly normalizationRuleRepository: Repository<NormalizationRule>,
  ) {}

  // 머천트 관련 메서드
  async createMerchant(createMerchantDto: CreateMerchantDto): Promise<Merchant> {
    // 이름 중복 확인
    const existingMerchant = await this.merchantRepository.findOne({
      where: { name_norm: createMerchantDto.name_norm },
    });

    if (existingMerchant) {
      throw new ConflictException('이미 존재하는 머천트명입니다.');
    }

    const merchant = this.merchantRepository.create(createMerchantDto);
    return await this.merchantRepository.save(merchant);
  }

  async findAllMerchants(): Promise<Merchant[]> {
    return await this.merchantRepository.find({
      relations: ['subscriptions', 'transactions'],
      order: { name_norm: 'ASC' },
    });
  }

  async findMerchantById(id: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { id },
      relations: ['subscriptions', 'transactions'],
    });

    if (!merchant) {
      throw new NotFoundException('머천트를 찾을 수 없습니다.');
    }

    return merchant;
  }

  async findMerchantByName(name: string): Promise<Merchant | null> {
    return await this.merchantRepository.findOne({
      where: { name_norm: name },
      relations: ['subscriptions', 'transactions'],
    });
  }

  async updateMerchant(id: string, updateMerchantDto: UpdateMerchantDto): Promise<Merchant> {
    const merchant = await this.findMerchantById(id);

    // 이름 변경 시 중복 확인
    if (updateMerchantDto.name_norm && updateMerchantDto.name_norm !== merchant.name_norm) {
      const existingMerchant = await this.findMerchantByName(updateMerchantDto.name_norm);
      if (existingMerchant) {
        throw new ConflictException('이미 존재하는 머천트명입니다.');
      }
    }

    Object.assign(merchant, updateMerchantDto);
    return await this.merchantRepository.save(merchant);
  }

  async removeMerchant(id: string): Promise<void> {
    const merchant = await this.findMerchantById(id);
    await this.merchantRepository.remove(merchant);
  }

  // 정규화 규칙 관련 메서드
  async createNormalizationRule(createRuleDto: CreateNormalizationRuleDto): Promise<NormalizationRule> {
    const rule = this.normalizationRuleRepository.create(createRuleDto);
    return await this.normalizationRuleRepository.save(rule);
  }

  async findAllNormalizationRules(): Promise<NormalizationRule[]> {
    return await this.normalizationRuleRepository.find({
      where: { is_active: true },
      order: { priority: 'DESC', canonical_name: 'ASC' },
    });
  }

  async findNormalizationRuleById(id: string): Promise<NormalizationRule> {
    const rule = await this.normalizationRuleRepository.findOne({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException('정규화 규칙을 찾을 수 없습니다.');
    }

    return rule;
  }

  async updateNormalizationRule(id: string, updateRuleDto: any): Promise<NormalizationRule> {
    const rule = await this.findNormalizationRuleById(id);
    Object.assign(rule, updateRuleDto);
    return await this.normalizationRuleRepository.save(rule);
  }

  async removeNormalizationRule(id: string): Promise<void> {
    const rule = await this.findNormalizationRuleById(id);
    await this.normalizationRuleRepository.remove(rule);
  }

  // 정규화 실행 메서드
  async normalizeMerchantName(rawName: string): Promise<{ normalizedName: string; category: string; cancelUrl: string }> {
    const rules = await this.findAllNormalizationRules();
    
    for (const rule of rules) {
      if (rule.hasSynonym(rawName)) {
        return {
          normalizedName: rule.canonical_name,
          category: rule.category || 'Unknown',
          cancelUrl: rule.cancel_url || '',
        };
      }
    }

    // 매칭되는 규칙이 없으면 원본 이름 반환
    return {
      normalizedName: rawName,
      category: 'Unknown',
      cancelUrl: '',
    };
  }

  async findOrCreateMerchant(rawName: string): Promise<Merchant> {
    // 먼저 정규화 시도
    const normalized = await this.normalizeMerchantName(rawName);
    
    // 이미 존재하는 머천트인지 확인
    let merchant = await this.findMerchantByName(normalized.normalizedName);
    
    if (!merchant) {
      // 새 머천트 생성
      merchant = await this.createMerchant({
        name_norm: normalized.normalizedName,
        name_original: rawName,
        category: normalized.category,
        cancel_url: normalized.cancelUrl,
        ruleset_version: '1.0.0',
      });
    }

    return merchant;
  }

  // IngestModule에서 사용할 메서드
  async findOrCreateByNormalization(rawName: string): Promise<Merchant> {
    return await this.findOrCreateMerchant(rawName);
  }

  // 통계 메서드
  async getMerchantStats() {
    const merchants = await this.findAllMerchants();
    
    return {
      totalMerchants: merchants.length,
      totalActiveSubscriptions: merchants.reduce((sum, m) => sum + m.activeSubscriptionCount, 0),
      totalRevenue: merchants.reduce((sum, m) => sum + m.totalRevenue, 0),
      categoryDistribution: this.getCategoryDistribution(merchants),
    };
  }

  private getCategoryDistribution(merchants: Merchant[]) {
    const distribution = {};
    merchants.forEach(merchant => {
      const category = merchant.category || 'Unknown';
      distribution[category] = (distribution[category] || 0) + 1;
    });
    return distribution;
  }
}
