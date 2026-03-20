import {
  BadRequestException,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { multerConfig } from './config/multer.config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { FileDocument } from './schemas/file.schema';

export const storage = diskStorage({
  destination: './public/uploads',
  filename(_req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 10)}`;
    const ext = extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get()
  async getAllFiles() {
    return await this.uploadService.getAllFiles();
  }

  @Post('single')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            errorMessage: 'File size is too large',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const savedFile = await this.uploadService.saveFile(file);

    return {
      message: 'File uploaded successfully',
      file: savedFile,
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    if (files.length > 10) {
      throw new BadRequestException('Maximum of 10 files allowed');
    }

    const savedFiles = await Promise.all(
      files.map((file) => this.uploadService.saveFile(file)),
    );

    return {
      message: 'Files uploaded successfully',
      files: savedFiles.map((file) => file),
    };
  }

  @Post('profile')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
      ],
      { storage },
    ),
  )
  async uploadProfile(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      cover?: Express.Multer.File[];
    },
  ) {
    const avatar = files.avatar?.[0];
    const cover = files.cover?.[0];

    const savedFiles: FileDocument[] = [];

    if (avatar) {
      savedFiles.push(await this.uploadService.saveFile(avatar));
    }

    if (cover) {
      savedFiles.push(await this.uploadService.saveFile(cover));
    }

    return {
      message: 'Profile images uploaded',
      avatar: avatar?.filename,
      cover: cover?.filename,
    };
  }

  @Post('multi-field')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file1', maxCount: 1 },
        { name: 'file2', maxCount: 2 },
      ],
      multerConfig,
    ),
  )
  uploadMultipleFields(
    @UploadedFiles()
    files: {
      file1: Express.Multer.File[];
      file2: Express.Multer.File[];
    },
  ) {
    return {
      message: 'Files uploaded!',
      field1: files.file1.map((file) => ({
        filename: file.fieldname,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      })),
      field2: files.file2.map((file) => ({
        filename: file.fieldname,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      })),
    };
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return this.uploadService.deleteFile(id);
  }
}
