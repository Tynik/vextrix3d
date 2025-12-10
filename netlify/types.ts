export type Nullable<T> = T | null;

export type NullableStringKeys<T> = {
  [K in keyof T]: T[K] extends Nullable<string> ? K : never;
}[keyof T];

export type DashCase<T extends string> = T extends `${infer First}-${infer Rest}`
  ? `${Lowercase<First>}-${DashCase<Rest>}`
  : Lowercase<T>;

export type Email = `${string}@${string}.${string}`;

export type EmailTemplateName = 'quote-request';

export type FileId = string;

export type FileRecord = {
  id: FileId;
  name: string;
  type: string;
  path: string;
  url: string;
};
