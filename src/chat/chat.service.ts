import { Injectable } from '@nestjs/common';

interface Message {
  id: string;
  username: string;
  message: string;
  room: string;
  timestamp: Date;
}

@Injectable()
export class ChatService {
  private messages: Message[] = [];
  private rooms = new Map<string, Set<string>>();

  addUserToRoom(room: string, username: string) {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }
    this.rooms.get(room)?.add(username);
  }

  removeUserFromRoom(room: string, username: string) {
    this.rooms.get(room)?.delete(username);
  }

  getRoomUsers(room: string) {
    return Array.from(this.rooms.get(room) || []);
  }

  saveMessage(username: string, message: string, room: string): Message {
    const msg: Message = {
      id: crypto.randomUUID(),
      username,
      message,
      room,
      timestamp: new Date(),
    };
    this.messages.push(msg);
    return msg;
  }

  getMessageHistory(room: string, limit: number = 50): Message[] {
    return this.messages.filter((msg) => room === msg.room).slice(-limit);
  }
}
