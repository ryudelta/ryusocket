import { Injectable } from '@nestjs/common';
import { SocketPath } from '@utils/header';
import { Server, Socket } from 'socket.io';

@Injectable()
@SocketPath('public')
export class PublicGatewayController {
  handleConnection(client: Socket, queryParams: any, server: Server) {
    server.emit(
      'connected',
      `Client connected to public path: ${client.id}, Query Params: ${JSON.stringify(queryParams)}`,
    );
  }
}
