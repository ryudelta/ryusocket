import { Injectable } from '@nestjs/common';
import { SocketPath } from '@utils/header';
import { Server, Socket } from 'socket.io';

@Injectable()
@SocketPath('private')
export class PrivateGatewayController {
  handleConnection(client: Socket, queryParams: any, server: Server) {
    server.emit(
      'connected',
      `Client connected to private path: ${client.id}, Query Params: ${JSON.stringify(queryParams)}`,
    );
  }
}
