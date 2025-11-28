import { NetlifyError } from '../errors';

export class NetlifyStoreError extends NetlifyError {
  public details: { status: string; statusCode: number; data: { error: string } };

  constructor(details: { status: string; statusCode: number; data: { error: string } }) {
    super(details.data.error);

    this.details = details;
    this.name = 'NetlifyStoreError';
  }
}
