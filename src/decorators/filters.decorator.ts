import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface FilterParams {
  [key: string]: any;
}

export const Filters = createParamDecorator(
  (allowedFilters: string[], ctx: ExecutionContext): FilterParams => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    const filters: FilterParams = {};

    allowedFilters.forEach((filter) => {
      if (query[filter] !== undefined) {
        if (typeof query[filter] === 'string' && query[filter].includes(',')) {
          filters[filter] = query[filter].split(',');
        } else {
          filters[filter] = query[filter];
        }
      }
    });

    return filters;
  },
);
