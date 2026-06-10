import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageRequestDto } from './dtos/send-message.request.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private activeUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(userId, client.id);
      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.activeUsers.forEach((value, key) => {
      if (value === client.id) {
        this.activeUsers.delete(key);
        console.log(`User ${key} disconnected with socket ${value}`);
      }
    });
  }

  @SubscribeMessage('send_message')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessageRequestDto,
  ): string {
    const receiverId = payload.receiverId;

    const receiverSocketId = this.activeUsers.get(receiverId);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_message', payload);
      return 'Message has been sent!';
    }

    return 'Can not find receiver, message has not been sent.';
  }
}
