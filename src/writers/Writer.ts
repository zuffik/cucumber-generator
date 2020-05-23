export interface Writer {
  write(content: string): Promise<void>;
}
