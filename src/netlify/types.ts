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
