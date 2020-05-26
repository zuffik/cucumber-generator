import { messages } from 'cucumber-messages';
import GherkinDocument = messages.GherkinDocument;

export type ParseResult = GherkinDocument[];

export interface Stop {
  label: string;
  parameters: string[];
  stop: 'given' | 'and' | 'then' | 'when';
}

export interface Scenario {
  label: string;
  examples: Record<string, (string | number)[]>;
  stops: Stop[];
}

export interface Feature {
  label: string;
  scenarios: Scenario[];
}
