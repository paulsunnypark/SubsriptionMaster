import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createServer, AddressInfo } from 'net';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function findAvailablePort(startPort: number, host = '0.0.0.0', maxTries = 20): Promise<number> {
  for (let port = startPort, tries = 0; tries < maxTries; port++, tries++) {
    const isFree = await new Promise<boolean>((resolve) => {
      const srv = createServer();
      srv.unref();
      srv.once('error', (err: any) => {
        if (err && (err.code === 'EADDRINUSE' || err.code === 'EACCES')) {
          resolve(false);
        } else {
          // Unknown error, treat as unavailable and continue
          resolve(false);
        }
      });
      srv.once('listening', () => {
        const addr = srv.address() as AddressInfo | null;
        srv.close(() => resolve(Boolean(addr)));
      });
      srv.listen(port, host);
    });
    if (isFree) return port;
  }
  // Fallback to OS-assigned free port
  return new Promise<number>((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.once('error', (err) => reject(err));
    srv.once('listening', () => {
      const addr = srv.address() as AddressInfo;
      const chosen = addr.port;
      srv.close(() => resolve(chosen));
    });
    srv.listen(0, host);
  });
}

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

  // CORS 설정 (다중 오리진 지원, 중복 헤더 방지)
  const corsEnv = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:3000';
  const allowList = corsEnv.split(',').map((o) => o.trim()).filter(Boolean);
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Origin 없는 요청 허용(서버-서버, curl 등)
      if (!origin) return callback(null, true);
      const allowed = allowList.some((o) => {
        if (o.startsWith('*.')) {
          const suffix = o.slice(1);
          return origin.endsWith(suffix);
        }
        return origin === o;
      });
      // 허용 시 요청 Origin을 그대로 반영(Access-Control-Allow-Origin 단일 값 보장)
      if (allowed) return callback(null, origin);
      return callback(new Error(`CORS blocked: ${origin} is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'X-Requested-With', 'X-Api-Key'],
    exposedHeaders: ['Content-Disposition'],
    maxAge: 600,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);

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

  // 애플리케이션 시작 (포트 충돌 시 자동 대체 포트 선택)
  const desiredPort = parseInt(String(process.env.PORT || 3001), 10);
  const host = process.env.HOST || '0.0.0.0';
  const port = await findAvailablePort(desiredPort, host);
  if (port !== desiredPort) {
    console.warn(`⚠️  Port ${desiredPort} in use. Falling back to ${port}.`);
  }
  await app.listen(port, host);

  const displayHost = host === '0.0.0.0' || host === '::' ? 'localhost' : host;
  console.log(`🚀 SubscriptionMaster 백엔드 서버가 포트 ${port}에서 실행 중입니다`);
  console.log(`📚 API 문서: http://${displayHost}:${port}/api/docs`);
}

bootstrap();
