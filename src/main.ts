import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

// 👉 Agrega esto para capturar errores inesperados y rechazos de promesas
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Rechazo de promesa no manejado:', reason);
  // Aquí puedes loguearlo, ignorarlo o notificarlo sin cerrar el proceso
});

process.on('uncaughtException', (err) => {
  console.error('🔥 Excepción no capturada:', err);
  // No haces process.exit() para que no se caiga
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://tomate-pos.vercel.app',
      'http://localhost:5174',
      'http://localhost:5173',
      'http://localhost:1420',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  // Usa body-parser con límites personalizados
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(8114);
}
bootstrap();
