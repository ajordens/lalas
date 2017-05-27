import {Feeding} from "./feeding";

export class FeedingSummary {
  date: string;
  numberOfFeedings: number;
  milkVolumeTotalMilliliters: number;
  milkVolumeAverageMilliliters: number;
  diaperCount: number;
  nursingDurationMinutes: number;

  feedings: Array<Feeding>;
}
