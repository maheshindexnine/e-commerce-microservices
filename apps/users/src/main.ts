import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create standard HTTP app
  const app = await NestFactory.create(UsersModule);

  // Enable CORS (optional, for Postman)
  app.enableCors();

  // Start HTTP server (for Postman requests)
  await app.listen(4000);
  console.log('HTTP server listening on http://localhost:3000');

  // Start microservice listener (still optional)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: '127.0.0.1', port: 3001 },
  });

  await app.startAllMicroservices();
  console.log('Microservice listening on TCP port 3001');
}
bootstrap();
