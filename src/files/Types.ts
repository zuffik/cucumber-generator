import { messages } from 'cucumber-messages';
import GherkinDocument = messages.GherkinDocument;

export type ParseResult = GherkinDocument[];

export interface Stop {
  label: string;
  stop: 'given' | 'and' | 'then' | 'when';
}

export type DataTable = Record<string, Record<string, any>[]>;

export interface Scenario {
  label: string;
  dataTable?: DataTable;
  stops: Stop[];
}

export interface Feature {
  label: string;
  scenarios: Scenario[];
}
