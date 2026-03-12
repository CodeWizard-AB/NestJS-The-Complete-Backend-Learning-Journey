import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class BooksService {
  private books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: '1984', author: 'George Orwell' },
  ];

  constructor(@Inject('CONFIG') private config: any) {
    console.log('Config:', this.config);
  }

  findAll() {
    return this.books;
  }
  findOne(id: number) {
    return this.books.find((book) => book.id === id);
  }
  update(id: number, updateBookDto: { title?: string; author?: string }) {
    const book = this.findOne(id);

    if (!book) {
      return { message: 'book not found!' };
    }

    if (updateBookDto.title) {
      book.title = updateBookDto.title;
    }
    if (updateBookDto.author) {
      book.author = updateBookDto.author;
    }
    return book;
  }
  delete(id: number) {
    return this.books.filter((book) => book.id !== id);
  }
}
