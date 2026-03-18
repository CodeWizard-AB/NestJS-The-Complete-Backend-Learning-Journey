import { ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost): void {
    super.catch(exception, host);

    const client = host.switchToWs().getClient<Socket>();
    const error = exception.getError() as string | Error;

    client.emit('error', {
      event: 'error',
      message: typeof error === 'string' ? error : error?.message,
      timestamp: new Date().toISOString(),
    });
  }
}
