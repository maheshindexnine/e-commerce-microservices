import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return this.usersService.getHello();
  }

  @MessagePattern({ cmd: 'get_users' })
  getUsers() {
    return [{ id: 1, name: 'Mahesh Gaikwad' }];
  }
}
