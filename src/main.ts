import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://blue-river-09bdb3d0f.5.azurestaticapps.net',
      'https://tomate-pos.vercel.app',
      'https://tomate-ksuxm5zwf-tomatepvs-projects.vercel.app',
      'http://localhost:5174',
      'http://localhost:5173',
      'http://localhost:1420',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  });

  // Usa body-parser con límites personalizados
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(8114);
}
bootstrap();
