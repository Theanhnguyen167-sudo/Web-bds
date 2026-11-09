export * from './database';
export * from './listing';
export * from './planning';
export * from './ai-report';
export * from './payment';
export * from './notification';
export * from './article';
export * from './deal';
export * from './contract';
export * from './broker-listing';
export * from './broker-lead';
export type {
  BrokerRole,
  SubscriptionTier,
  BrokerProfile,
  IncomeStatus,
  NavItem,
  NavSection,
} from './broker-nav';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
