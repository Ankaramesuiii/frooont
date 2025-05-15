export interface Training {
    id: number;
    startDate: string;
    endDate: string;
    codeSession: string;
    duration: number;
    mode: string;
    status: string;
    presence: string;
    creationDate: string;
    codeDA: string;
    internalTrainer: boolean;
    price: number;
    currency: string;
    exchangeRate: number;
    priceTND: number;
    themeName: string;
    teamMemberName?: string;
  }
  