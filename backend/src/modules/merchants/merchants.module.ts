import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';
import { Merchant } from './entities/merchant.entity';
import { NormalizationRule } from './entities/normalization-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant, NormalizationRule])],
  controllers: [MerchantsController],
  providers: [MerchantsService],
  exports: [MerchantsService],
})
export class MerchantsModule {}
