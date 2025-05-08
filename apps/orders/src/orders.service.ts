import { Injectable } from '@nestjs/common';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { User } from 'apps/users/src/schemas/user.schema';
import { Product } from 'apps/products/src/schemas/product.schema';

@Injectable()
export class OrdersService {
  @Client({
    transport: Transport.TCP,
    options: { host: 'localhost', port: 3001 },
  })
  private userClient: ClientProxy;
  @Client({
    transport: Transport.TCP,
    options: { host: 'localhost', port: 3002 },
  })
  private productClient: ClientProxy;
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  getHello(): string {
    return 'Hello from products';
  }
  async create(data: Partial<Order>) {
    const newOrder = new this.orderModel(data);
    return newOrder.save();
  }

  async findAll(): Promise<any[]> {
    const orders: OrderDocument[] = await this.orderModel.find().exec();

    const orderWithDetails: any[] = await Promise.all(
      orders.map(async (order) => {
        const user: User = await this.userClient
          .send({ cmd: 'get_user' }, order.userId.toString())
          .toPromise();

        const detailedProducts = await Promise.all(
          order.products.map(async (item) => {
            const product: Product = await this.productClient
              .send({ cmd: 'internal_get_product' }, item.productId.toString())
              .toPromise();

            const vendor: User = await this.userClient
              .send({ cmd: 'get_user' }, item.vendorId.toString())
              .toPromise();

            return {
              price: item.price,
              product,
              vendor,
            };
          }),
        );

        const { userId, products, ...rest } = order.toObject();
        return {
          ...rest,
          user,
          products: detailedProducts,
        };
      }),
    );

    return orderWithDetails;
  }

  async findById(id: string): Promise<any> {
    const order: OrderDocument | null = await this.orderModel
      .findById(id)
      .exec();

    if (!order) {
      return null;
    }

    // Fetch user (buyer) data
    const user: User = await this.userClient
      .send({ cmd: 'get_user' }, order.userId.toString())
      .toPromise();

    // Fetch vendor and product data for each product in the order
    const detailedProducts = await Promise.all(
      order.products.map(async (item) => {
        const product: Product = await this.productClient
          .send({ cmd: 'internal_get_product' }, item.productId.toString())
          .toPromise();

        const vendor: User = await this.userClient
          .send({ cmd: 'get_user' }, item.vendorId.toString())
          .toPromise();

        return {
          price: item.price,
          product,
          vendor,
        };
      }),
    );

    const { userId, products, ...rest } = order.toObject();
    return {
      ...rest,
      user,
      products: detailedProducts,
    };
  }

  async update(id: string, data: Partial<Order>) {
    return this.orderModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
