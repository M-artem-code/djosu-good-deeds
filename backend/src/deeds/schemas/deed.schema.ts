import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DeedDocument = HydratedDocument<Deed>;

export enum DeedStatus {
  Planned = 'planned',
  Done = 'done',
}

@Schema({ timestamps: true })
export class Deed {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, maxlength: 120 })
  title: string;

  @Prop({ maxlength: 500 })
  description?: string;

  @Prop({ required: true, enum: DeedStatus, default: DeedStatus.Planned })
  status: DeedStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const DeedSchema = SchemaFactory.createForClass(Deed);

DeedSchema.index({ ownerId: 1, createdAt: -1 });
