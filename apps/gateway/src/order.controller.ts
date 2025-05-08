import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './jwt-auth.guard';
import { firstValueFrom } from 'rxjs';

@Controller('api/v1/orders')
export class OrderController {
  constructor(
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: any, @Request() req) {
    const userId = req.user.sub;
    return firstValueFrom(
      this.orderService.send(
        {
          cmd: 'create_order',
        },
        { ...body, userId },
      ),
    );
  }

  @Get()
  async findAll() {
    return firstValueFrom(this.orderService.send({ cmd: 'get_orders' }, {}));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return firstValueFrom(this.orderService.send({ cmd: 'get_order' }, id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return firstValueFrom(
      this.orderService.send({ cmd: 'update_order' }, { id, update: body }),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return firstValueFrom(this.orderService.send({ cmd: 'delete_order' }, id));
  }
}
