import { Logger } from '@nestjs/common';
import { SocketPath } from '@utils/header';
import { Server, Socket } from 'socket.io';
import { WebsocketService } from '../services/websocket/websocket.service';

@SocketPath('public')
export class PublicGatewayController {
  private readonly logger = new Logger(PublicGatewayController.name);
  constructor(private readonly websocketService: WebsocketService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, queryParams: any, server: Server) {
    this.websocketService.subscribeToStream(
      client,
      client['clientId'],
      queryParams,
    );
    const success = {
      success: {
        message: 'subcribed',
        scope: 'public',
        streams: queryParams,
      },
    };

    client.send(JSON.stringify(success));
  }
}
