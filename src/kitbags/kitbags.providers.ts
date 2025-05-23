import { Mongoose } from 'mongoose';
import { KITBAGS_MODEL } from '../consts/models.const';
import { KitbagSchema } from './schemas/kitbag.schema';

export const kitbagsProviders = [
  {
    provide: KITBAGS_MODEL,
    useFactory: (mongoose: Mongoose) => mongoose.model('Kitbag', KitbagSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
