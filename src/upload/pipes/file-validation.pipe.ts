import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size is too large');
    }

    const allowedTyped = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTyped.includes(file.mimetype)) {
      throw new BadRequestException('File type is not allowed');
    }

    return file;
  }
}
