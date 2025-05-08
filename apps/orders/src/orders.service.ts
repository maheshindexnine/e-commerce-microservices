import { Injectable } from '@nestjs/common';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

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

  async findAll() {
    const orders = await this.orderModel.find().exec();

    // Use client to request user data for each product
    const orderWithUsers = await Promise.all(
      orders.map(async (order) => {
        const user = await this.userClient
          .send({ cmd: 'get_user' }, order.userId)
          .toPromise();
        const vendor = await this.userClient
          .send({ cmd: 'get_user' }, order.vendorId)
          .toPromise();
        const product = await this.productClient
          .send({ cmd: 'internal_get_product' }, order.productId)
          .toPromise();
        const { userId, vendorId, productId, ...rest } = order.toObject();
        return { ...rest, user, vendor, product };
      }),
    );

    return orderWithUsers;
  }

  async findById(id: string) {
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      return null;
    }

    const user = await this.userClient
      .send({ cmd: 'get_user' }, order.userId)
      .toPromise();
    const vendor = await this.userClient
      .send({ cmd: 'get_user' }, order.vendorId)
      .toPromise();
    const product = await this.productClient
      .send({ cmd: 'internal_get_product' }, order.productId)
      .toPromise();
    const { userId, vendorId, productId, ...rest } = order.toObject(); // remove userId if not needed in response

    return {
      ...rest,
      user,
      vendor,
      product,
    };
  }

  async update(id: string, data: Partial<Order>) {
    return this.orderModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
