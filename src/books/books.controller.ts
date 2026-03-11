import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

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
