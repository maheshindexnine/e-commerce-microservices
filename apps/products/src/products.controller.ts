import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getHello(): string {
    return this.productsService.getHello();
  }

  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() data: any) {
    return this.productsService.create(data);
  }

  @MessagePattern({ cmd: 'get_products' })
  findAll() {
    return this.productsService.findAll();
  }

  @MessagePattern({ cmd: 'get_product' })
  findById(@Payload() id: string) {
    return this.productsService.findById(id);
  }

  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() data: { id: string; update: any }) {
    return this.productsService.update(data.id, data.update);
  }

  @MessagePattern({ cmd: 'delete_product' })
  delete(@Payload() id: string) {
    return this.productsService.delete(id);
  }
}
