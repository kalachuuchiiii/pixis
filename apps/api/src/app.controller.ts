import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PASSWORD_MAX } from '@pixis/constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }


  @Get()
  getHello() {
    return `Hello, ${PASSWORD_MAX}`
  }
}
