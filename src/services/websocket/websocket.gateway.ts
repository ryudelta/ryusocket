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

@WebSocketGateway(4000, { serveClient: true })
export class BaseWebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(BaseWebsocketGateway.name);
  private queryStream: string[] = [''];

  constructor(
    private readonly publicGateway: PublicGatewayController,
    private readonly privateGateway: PrivateGatewayController,
    private readonly websocketService: WebsocketService,
  ) {}

  afterInit() {
    this.logger.log('Web socket started');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: Socket, data: any) {
    console.log(data.headers.authorization);

    const clientId = extractClientId(data);
    const parsedUrl = parse(data.url);

    if (client['clientId']) {
      this.websocketService.closeConnection(client);
    }

    client['clientId'] = clientId;
    client['authorization'] = data.headers.authorization;

    const path = parsedUrl.name;

    const controllerClass =
      path == 'public' ? this.publicGateway : await this.privateGateway;

    if (parsedUrl['base'] != null || parsedUrl['base'] != '') {
      this.queryStream = QueryStream(parsedUrl['base']);
      if (!this.queryStream){
        this.queryStream = [''];
      }
    } else {
      this.queryStream = [''];
    }

    controllerClass.handleConnection(client, this.queryStream, this.server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`client disconnect : ${client['clientId']}`);
    this.websocketService.unsubscribeFromStream(client);

    this.server.emit('disconnected', `Client disconnected: ${client.id}`);
  }
}
