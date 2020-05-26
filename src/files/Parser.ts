import Gherkin from 'gherkin';
import { messages } from 'cucumber-messages';
import { Feature, ParseResult, Scenario, Stop } from './Types';
import * as path from 'path';
import GherkinDocument = messages.GherkinDocument;
import { flatten } from 'array-flatten';

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
            examples: Object.assign(
              {},
              ...flatten(
                flatten(pickle.scenario?.examples || []).map((e) =>
                  (e.tableHeader?.cells || []).map((h, i) => ({
                    [h.value || '']: (e.tableBody || []).map((b) => b.cells?.[i].value || ''),
                  }))
                )
              )
            ),
            stops:
              pickle.scenario?.steps?.map((step) => {
                const parameters: string[] = [];
                if (step.dataTable) {
                  parameters.push('data');
                }
                let matches: RegExpExecArray | null;
                let rgx = /<([a-zA-Z0-9\s:_-]+)>/g;
                while ((matches = rgx.exec(step.text || '')) != null) {
                  parameters.push(matches[1]);
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
