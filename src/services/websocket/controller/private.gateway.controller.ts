import { Logger } from '@nestjs/common';
import { SocketPath } from '@utils/header';
import { Server, Socket } from 'socket.io';
import { WebsocketService } from '../services/websocket/websocket.service';
import { headerValidate } from '@utils/index';

@SocketPath('private')
export class PrivateGatewayController {
  private readonly logger = new Logger(PrivateGatewayController.name);
  constructor(private readonly websocketService: WebsocketService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, queryParams: any, server: Server) {
    const validate = headerValidate(client, 'authorization');
    if (!validate) {
      const message = {
        failed: {
          message: 'subcribed',
          scope: 'private',
          reason: 'Auth is missing',
        },
      };

      this.websocketService.closeConnection(client);
      client.send(JSON.stringify(message));
      return;
    }

    this.websocketService.subscribeToStream(
      client,
      client['clientId'],
      queryParams,
    );
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
