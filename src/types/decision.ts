export interface TechnicalDecision {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly detail: string;
  readonly tradeoff?: {
    readonly label: string;
    readonly value: string;
  };
}
