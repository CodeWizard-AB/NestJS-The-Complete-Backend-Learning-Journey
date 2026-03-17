import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JoinChatDto } from './dto/join-chat.dto';
import { SendMessgeDto } from './dto/send-message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger(ChatGateway.name);
  private userSockets = new Map<string, { username: string; room: string }>();

  constructor(private readonly chatService: ChatService) {}

  afterInit(client: Socket) {
    this.logger.log('Chat Gateway initialized!');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userInfo = this.userSockets.get(client.id);

    if (userInfo) {
      const { username, room } = userInfo;

      this.chatService.removeUserFromRoom(username, room);
      client.leave(room);

      this.server.to(room).emit('user-left', {
        username,
        users: this.chatService.getRoomUsers(room),
      });

      this.userSockets.delete(client.id);
      this.logger.log(`${username} left ${room}`);
    }
  }

  @SubscribeMessage('join-room')
  handleJoin(
    @MessageBody() data: JoinChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { username, room } = data;
    client.join(room);

    this.userSockets.set(client.id, { username, room });
    this.chatService.addUserToRoom(room, username);

    const history = this.chatService.getMessageHistory(room);
    client.emit('message-history', history);

    this.server.to(room).emit('user-joined', {
      username,
      users: this.chatService.getRoomUsers(room),
    });

    return { success: true };
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() data: SendMessgeDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userInfo = this.userSockets.get(client.id);

    if (!userInfo) {
      return { event: 'error', data: 'Not in a room' };
    }

    const message = this.chatService.saveMessage(
      userInfo.username,
      data.message,
      userInfo.room,
    );

    this.server.to(userInfo.room).emit('new-message', message);
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket) {
    const userInfo = this.userSockets.get(client.id);
    if (userInfo) {
      client.broadcast.to(userInfo.room).emit('user-typing', userInfo.username);
    }
  }
}
