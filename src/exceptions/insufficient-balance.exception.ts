import { BadRequestException } from '@nestjs/common';

export class InSufficientBalanceException extends BadRequestException {
  constructor(required: number, available: number) {
    super({
      statusCode: 400,
      message: 'Insufficient balance',
      error: 'InsufficientBalance',
      details: {
        required,
        available,
        shortfall: required - available,
      },
    });
  }
}
