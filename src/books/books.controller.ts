import { Controller, Delete, Get, Inject, Patch } from '@nestjs/common';
import { BooksService } from './books.service';
import { type Logger } from './logger.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    @Inject('LOGGER') private readonly booksLogger: Logger,
  ) {
    booksLogger.log('BooksController initialized');
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(id: number) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(id: number, updateBookDto: { title?: string; author?: string }) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(id: number) {
    return this.booksService.delete(id);
  }
}
