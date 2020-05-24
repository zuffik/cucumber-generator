import Gherkin from 'gherkin';
import { messages } from 'cucumber-messages';
import { DataTable, Feature, ParseResult, Scenario, Stop } from './Types';
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
          (pickle): Scenario => {
            let dataTable: DataTable | undefined = undefined;
            const stepsWithData = pickle.scenario?.steps?.filter((step) => step.dataTable);
            if (stepsWithData && stepsWithData.length > 0) {
              dataTable = Object.assign(
                {},
                ...stepsWithData.map((s) => ({
                  [s.text || '']:
                    s
                      .dataTable!.rows?.slice(1)
                      .map((row) =>
                        Object.assign(
                          {},
                          ...(row.cells?.map((cell, i) => ({
                            [s.dataTable!.rows?.[0]?.cells?.[i]?.value || '']: cell.value,
                          })) || [])
                        )
                      ) || [],
                }))
              );
            }
            return {
              label: pickle.scenario?.name || '',
              dataTable,
              stops:
                pickle.scenario?.steps?.map((step) => ({
                  label: step.text || '',
                  stop: (step.keyword || '').trim().toLowerCase() as Stop['stop'],
                })) || [],
            };
          }
        ) || [],
    }));
  }
}
