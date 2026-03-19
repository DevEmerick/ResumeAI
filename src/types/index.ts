export type SubscriptionType = "FREE" | "PRO" | "TEAM";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  subscriptionType: SubscriptionType;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  content: string;
  analysis?: string;
  createdAt: string;
}
