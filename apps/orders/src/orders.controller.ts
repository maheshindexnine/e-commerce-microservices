import { OrdersService } from './orders.service';
import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getHello(): string {
    return this.ordersService.getHello();
  }

  @MessagePattern({ cmd: 'create_order' })
  create(@Payload() data: any) {
    return this.ordersService.create(data);
  }

  @MessagePattern({ cmd: 'get_orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern({ cmd: 'get_order' })
  findById(@Payload() id: string) {
    return this.ordersService.findById(id);
  }

  @MessagePattern({ cmd: 'update_order' })
  update(@Payload() data: { id: string; update: any }) {
    return this.ordersService.update(data.id, data.update);
  }

  @MessagePattern({ cmd: 'delete_order' })
  delete(@Payload() id: string) {
    return this.ordersService.delete(id);
  }
}
