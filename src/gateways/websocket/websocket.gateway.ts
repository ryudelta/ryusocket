import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PublicGatewayController } from './controller/public.gateway.controller';
import { PrivateGatewayController } from './controller/private.gateway.controller';
import { parse } from 'path';
import { WebsocketService } from './services/websocket/websocket.service';
import { extractClientId } from '@utils/header';
import { QueryStream } from '@utils/index';

@WebSocketGateway(4000)
export class BaseWebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(BaseWebsocketGateway.name);

  constructor(
    private readonly publicGateway: PublicGatewayController,
    private readonly privateGateway: PrivateGatewayController,
    private readonly websocketService: WebsocketService,
  ) {}
  afterInit() {
    this.logger.log('Initialized');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, data: any) {
    const clientId = extractClientId(data);
    const parsedUrl = parse(data.url);

    const queryStream = QueryStream(parsedUrl['base']);

    client['clientId'] = clientId;

    const path = parsedUrl.name;

    const controllerClass =
      path == 'public' ? this.publicGateway : this.privateGateway;

    controllerClass.handleConnection(client, queryStream, this.server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`client disconnect : ${client['clientId']}`);
    this.websocketService.unsubscribeFromStream(client);

    this.server.emit('disconnected', `Client disconnected: ${client.id}`);
  }
}
