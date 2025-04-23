export interface Thresholds {
  Upper: number;
  Lower: number;
}

export interface Printer {
  PrinterId: string;  // This is the primary key in DynamoDB, not 'id'
  EventCount: number;  // This exists in your DynamoDB schema
  OutOfBoundsCount?: number;  // Optional field based on DynamoDB item
  Thresholds: Thresholds;  // Nested object for thresholds
  Window?: number;  // Optional field based on DynamoDB item
}
