import { Logger } from '@nestjs/common';
import { SocketPath } from '@utils/header';
import { Server, Socket } from 'socket.io';
import { WebsocketService } from '../services/websocket/websocket.service';

@SocketPath('private')
export class PrivateGatewayController {
  private readonly logger = new Logger(PrivateGatewayController.name);
  constructor(private readonly websocketService: WebsocketService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, queryParams: any, server: Server) {
    this.websocketService.subscribeToStream(client, queryParams);
    const success = {
      success: {
        message: 'subcribed',
        scope: 'private',
        streams: queryParams,
      },
    };

    client.send(JSON.stringify(success));
  }
}
