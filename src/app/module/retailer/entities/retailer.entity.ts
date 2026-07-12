import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RetailerDocument = HydratedDocument<Retailer>;

@Schema({ timestamps: true })
export class Retailer {
  @Prop()
  businessName!: string;

  @Prop()
  address!: string;

  @Prop()
  phoneNumber!: string;

  @Prop()
  city!: string;
}

export const RetailerSchema = SchemaFactory.createForClass(Retailer);
