import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class Location {
  @Prop({
    type: String,
    enum: ['Point'],
  })
  type: string;

  @Prop({
    type: [Number],
  })
  coordinates: [number];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
