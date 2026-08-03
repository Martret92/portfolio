export interface ArchitectureNode {
  readonly id: string;
  readonly label: string;
  readonly category?: string;
  readonly description: string;
}

export interface ArchitectureConnection {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly label: string;
}
