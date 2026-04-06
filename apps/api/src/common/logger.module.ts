import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

const isProd = process.env.NODE_ENV === 'production';

@Global()
@Module({ 
  imports: [
    WinstonModule.forRoot({
      transports: isProd
        ? [
            new winston.transports.File({
              filename: 'logs/error.log',
              level: 'error',
            }),
            new winston.transports.File({ filename: 'logs/combined.log' }),
          ]
        : [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
              ),
            }),
          ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
