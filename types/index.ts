export * from './database';
export * from './listing';
export * from './planning';
export * from './ai-report';
export * from './payment';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
