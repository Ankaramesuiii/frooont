export interface TeamMember {
    readonly id: string;
    name: string;
    email: string;
    post?: string;
    phone?: string;
    manager?: string;
    superManager?: string;
    businessUnit?: string;
    remainingBudget?: number | string;
  }