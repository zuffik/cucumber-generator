import Gherkin from 'gherkin';
import { messages } from 'cucumber-messages';
import { Feature, ParseResult, Scenario, Stop } from './Types';
import * as path from 'path';
import GherkinDocument = messages.GherkinDocument;

type Envelope = messages.Envelope;

export class Parser {
  constructor(private readonly rootDir: string) {}

  public async parse(name: string): Promise<ParseResult> {
    const envelopes = await new Promise<Envelope[]>((resolve, reject) => {
      const readable = Gherkin.fromPaths([path.join(this.rootDir, name)], {
        includeGherkinDocument: true,
        includePickles: true,
        includeSource: false,
      });
      const envelopes: Envelope[] = [];
      readable.on('data', (d: Envelope) => envelopes.push(d));
      readable.on('end', () => resolve(envelopes));
      readable.on('error', reject);
    });
    return envelopes
      .filter((e) => e.gherkinDocument)
      .map((d) => GherkinDocument.create(d.gherkinDocument!));
  }

  public static toFeatures(doc: ParseResult): Feature[] {
    return doc.map((doc) => ({
      label: doc.feature?.name || '',
      scenarios:
        doc.feature?.children?.map(
          (pickle): Scenario => ({
            label: pickle.scenario?.name || '',
            stops:
              pickle.scenario?.steps?.map((step) => {
                const parameters: string[] = [];
                if (step.dataTable) {
                  parameters.push('data');
                }
                return {
                  label: step.text || '',
                  parameters,
                  stop: (step.keyword || '').trim().toLowerCase() as Stop['stop'],
                };
              }) || [],
          })
        ) || [],
    }));
  }
}
