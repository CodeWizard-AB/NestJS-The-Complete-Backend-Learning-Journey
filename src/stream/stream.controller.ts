import {
  Controller,
  Get,
  NotFoundException,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { join } from 'path';

@Controller('stream')
export class StreamController {
  // * Stream file
  @Get('file/:filename')
  async streamFile(
    @Param('filename') filename: string,
  ): Promise<StreamableFile> {
    const filePath = join(process.cwd(), 'public', 'uploads', filename);

    try {
      await stat(filePath);
      const file = createReadStream(filePath);
      return new StreamableFile(file);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  // * Stream image
  @Get('image/:filename')
  async streamImage(
    @Param('filename') filename: string,
  ): Promise<StreamableFile> {
    const filePath = join(process.cwd(), 'public', 'uploads', filename);

    try {
      await stat(filePath);
      const file = createReadStream(filePath);
      const ext = filename.split('.').pop()?.toLowerCase();
      return new StreamableFile(file, { type: `image/${ext}` });
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  // * Stream pdf
  @Get('pdf/:filename')
  async streamPdf(
    @Param('filename') filename: string,
  ): Promise<StreamableFile> {
    const filePath = join(process.cwd(), 'public', 'uploads', filename);

    try {
      await stat(filePath);
      const file = createReadStream(filePath);
      return new StreamableFile(file, { type: 'application/pdf' });
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
}
