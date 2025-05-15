export interface Manager {
    name: string;
    email: string;
    teamMembers: string[];
    teamName: string;
    superManager: string;
    remainingBudget: number;
    teamBudget: number;
    businessUnit: string;
  }