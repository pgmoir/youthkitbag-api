import { Mongoose } from 'mongoose';
import { USERS_MODEL } from '../consts/models.const';
import { UserSchema } from './schemas/user.schema';

export const usersProviders = [
  {
    provide: USERS_MODEL,
    useFactory: (mongoose: Mongoose) => mongoose.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
