import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './public/uploads',
    filename(_req, file, cb) {
      const filename = `${file.fieldname}-${file.originalname}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf)$/)) {
      return cb(new BadRequestException('File type is not allowed'), false);
    }
    cb(null, true);
  },
};
