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

@Controller('api/v1/products') // Prefix route with 'products'
export class ProductsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productService: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createProductDto: any) {
    return firstValueFrom(
      this.productService.send({ cmd: 'create_product' }, createProductDto),
    );
  }

  @Get()
  async findAll() {
    return firstValueFrom(
      this.productService.send({ cmd: 'get_products' }, {}),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return firstValueFrom(this.productService.send({ cmd: 'get_product' }, id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    return firstValueFrom(
      this.productService.send(
        { cmd: 'update_product' },
        { id, update: updateProductDto },
      ),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return firstValueFrom(
      this.productService.send({ cmd: 'delete_product' }, id),
    );
  }
}
