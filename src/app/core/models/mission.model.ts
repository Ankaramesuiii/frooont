// mission.model.ts
export interface MissionRequest {
    teamMemberIds: string;
    destination: string;
    startDate: string;
    endDate?: string;
    reason: string;
    cost: number;
  }
  