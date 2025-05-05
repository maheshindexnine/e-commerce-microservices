import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return this.usersService.getHello();
  }

  @MessagePattern({ cmd: 'create_user' })
  create(@Payload() data: any) {
    return this.usersService.create(data);
  }

  @MessagePattern({ cmd: 'get_users' })
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'get_user' })
  findById(@Payload() id: string) {
    return this.usersService.findById(id);
  }

  @MessagePattern({ cmd: 'update_user' })
  update(@Payload() data: { id: string; update: any }) {
    return this.usersService.update(data.id, data.update);
  }

  @MessagePattern({ cmd: 'delete_user' })
  delete(@Payload() id: string) {
    return this.usersService.delete(id);
  }
}
