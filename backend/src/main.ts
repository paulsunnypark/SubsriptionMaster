import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 글로벌 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS 설정
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // 글로벌 프리픽스 설정
  app.setGlobalPrefix('api/v1');

  // Swagger 문서 설정
  const config = new DocumentBuilder()
    .setTitle('SubscriptionMaster API')
    .setDescription('구독 관리 및 비용 절감 플랫폼 API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('auth', '인증 관련')
    .addTag('users', '사용자 관리')
    .addTag('subscriptions', '구독 관리')
    .addTag('merchants', '머천트 관리')
    .addTag('ingest', '데이터 수집')
    .addTag('alerts', '알림 시스템')
    .addTag('savings', '절감 관리')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 애플리케이션 시작
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 SubscriptionMaster 백엔드 서버가 포트 ${port}에서 실행 중입니다`);
  console.log(`📚 API 문서: http://localhost:${port}/api/docs`);
}

bootstrap();
