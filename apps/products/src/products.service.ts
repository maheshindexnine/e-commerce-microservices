import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  @Client({
    transport: Transport.TCP,
    options: { host: 'localhost', port: 3001 },
  })
  private client: ClientProxy;
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  getHello(): string {
    return 'Hello from products';
  }
  async create(data: Partial<Product>) {
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  async findAll() {
    const products = await this.productModel.find().exec();

    // Use client to request user data for each product
    const productWithUsers = await Promise.all(
      products.map(async (product) => {
        const user = await this.client
          .send({ cmd: 'get_user' }, product.userId)
          .toPromise();
        const { userId, ...rest } = product.toObject();
        return { ...rest, user };
      }),
    );

    return productWithUsers;
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id).exec();
  
    if (!product) {
      return null;
    }
    
    const user = await this.client
      .send({ cmd: 'get_user' }, product.userId)
      .toPromise();
  
    const { userId, ...rest } = product.toObject(); // remove userId if not needed in response
  
    return {
      ...rest,
      user,
    };
  }

  async update(id: string, data: Partial<Product>) {
    return this.productModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
