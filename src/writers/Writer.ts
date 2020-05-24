export interface Writer {
  write(featureFile: string, content: string): Promise<boolean>;
}
