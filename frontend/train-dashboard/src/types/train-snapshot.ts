import { TrainBundle } from './index';

export interface TrainSnapshot {
  type: string;
  timestamp: string;
  payload: TrainBundle[];
}
