import { Document } from 'mongoose';
import { KitbagStates } from '../../enums/kitbagStates.enum';

export interface Kitbag extends Document {
  readonly _id: string;
  readonly name: string;
  readonly space: string;
  readonly description?: string;
  readonly activitys?: string[];
  readonly state: KitbagStates;
}
