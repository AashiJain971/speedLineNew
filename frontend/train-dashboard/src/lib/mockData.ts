import { Disruption, HealthResponse, TrainBundle } from "../types";

export const mockDisruptions: Disruption[] = [
  {
    section_id: "S1-2",
    type: "maintenance",
    severity: "medium",
    start_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    estimated_end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    description: "Scheduled track maintenance between S1 and S2",
    affected_trains: ["T-101", "T-202"],
  },
];

export const mockHealthData: HealthResponse = {
  status: "ok",
  timestamp: new Date().toISOString(),
  total_trains: 24,
  active_trains: 18,
  active_disruptions: mockDisruptions.length,
  disrupted_sections: mockDisruptions.map((d) => d.section_id),
};

export const mockTrainData: { payload: TrainBundle[] } = {
  payload: [
    {
      train: {
        train_id: "T-101",
        type: "Express",
        priority: 1,
        max_speed_kmh: 160,
        length_m: 200,
        direction: "forward",
        destination_station: "S5",
        current_location: { section_id: "S1-2", position_m: 5000 },
        status: "On time",
        actual_departure: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        actual_arrival: null,
        journey_count: 1,
      },
      section: {
        section_id: "S1-2",
        start_station: "S1",
        end_station: "S2",
        length_km: 10,
        capacity: 4,
        max_speed_kmh: 120,
        track_type: "double",
        is_disrupted: true,
        occupancy_count: 2,
      },
      signal: {
        block_id: "B-12",
        section_id: "S1-2",
        occupancy_status: "occupied",
        occupying_trains: 1,
        signal_type: "automatic",
        headway_time_s: 90,
        priority_override: false,
      },
      event: {
        event_type: "position_update",
        train_id: "T-101",
        section_id: "S1-2",
        timestamp: new Date().toISOString(),
        disruption_details: null,
        delay_duration_min: 0,
      },
    },
  ],
};
