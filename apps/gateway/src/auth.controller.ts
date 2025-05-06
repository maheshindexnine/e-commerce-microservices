import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  // @Post()
  // async create(@Body() createUserDto: any) {
  //   return firstValueFrom(
  //     this.userService.send({ cmd: 'create_user' }, createUserDto),
  //   );
  // }

  @Post('register')
  create(@Body() createUserDto: any) {
    return this.userService.send({ cmd: 'register_user' }, createUserDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.userService.send({ cmd: 'login_user' }, body);
  }
}
