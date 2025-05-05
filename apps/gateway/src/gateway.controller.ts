import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class GatewayController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createUserDto: any) {
    return firstValueFrom(
      this.userService.send({ cmd: 'create_user' }, createUserDto),
    );
  }

  @Get()
  async findAll() {
    return firstValueFrom(this.userService.send({ cmd: 'get_users' }, {}));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return firstValueFrom(this.userService.send({ cmd: 'get_user' }, id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    return firstValueFrom(
      this.userService.send(
        { cmd: 'update_user' },
        { id, update: updateUserDto },
      ),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return firstValueFrom(this.userService.send({ cmd: 'delete_user' }, id));
  }
}
