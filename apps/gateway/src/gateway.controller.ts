import { Controller, Get, Inject } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class GatewayController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Get()
  async getUsers() {
    return this.userService.send({ cmd: 'get_users' }, {}).toPromise();
  }
}
