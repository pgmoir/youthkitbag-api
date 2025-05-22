import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { patterns } from 'src/utils/patterns.util';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    lowercase: true,
    trim: true,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: function (value: string) {
        return patterns.email.test(value);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
  })
  email: string;

  @Prop({
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    validate: {
      validator: function (value: string) {
        return patterns.password.test(value);
      },
      message:
        'Password must be at least 8 characters and include at least one lowercase character, one uppercase character, one number and one special character',
    },
  })
  password: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
