import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Location, LocationSchema } from 'src/schemas/location.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    trim: true,
    required: [true, 'First name is required'],
  })
  firstName: string;

  @Prop({
    type: String,
    trim: true,
    required: [true, 'Last name is required'],
  })
  lastName: string;

  @Prop({
    type: String,
    lowercase: true,
    trim: true,
    required: [true, 'Email is required'],
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    select: false,
  })
  password: string;

  @Prop({
    type: Number,
    default: 0,
    select: false,
  })
  passwordAttempts: number;

  @Prop({
    type: Boolean,
    default: false,
    select: false,
  })
  passwordLocked: boolean;

  @Prop({
    type: String,
    trim: true,
    default: '',
  })
  postcode: string;

  @Prop({ type: LocationSchema })
  location: Location;
}

export const UserSchema = SchemaFactory.createForClass(User);
