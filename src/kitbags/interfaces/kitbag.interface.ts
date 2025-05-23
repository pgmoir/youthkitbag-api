import { Document } from 'mongoose';
import { KitbagStates } from 'src/enums/kitbagStates.enum';

export interface Kitbag extends Document {
  readonly name: string;
  readonly space: string;
  readonly description?: string;
  readonly activitys?: string[];
  readonly state: KitbagStates;
}
