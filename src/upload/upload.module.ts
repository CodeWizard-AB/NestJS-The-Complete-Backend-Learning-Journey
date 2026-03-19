import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerConfig } from './config/multer.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MulterModule.register(multerConfig),
  ],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
