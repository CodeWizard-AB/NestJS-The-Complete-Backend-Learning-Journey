import { SetMetadata } from '@nestjs/common';

export const CLAIM_KEY = 'required_claims';

export const ClaimRequired = (...claims: { key: string; value: any }[]) =>
  SetMetadata(CLAIM_KEY, claims);
