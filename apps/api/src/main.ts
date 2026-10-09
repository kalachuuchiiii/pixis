import { NestFactory } from "@nestjs/core";
import { configureApp } from "./configureApp";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureApp(app);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();

