// apps/users/src/schemas/order.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class OrderProduct {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true }) // Individual product price at the time of order
  price: number;
}

const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderProductSchema], required: true })
  products: OrderProduct[];

  @Prop({ required: true }) // Total price of the order
  totalPrice: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
