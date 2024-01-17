import { ModuleRef } from '@nestjs/core';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SocketPath } from '@utils/header';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { parse } from 'url';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(13000, { cors: '*' })
export class BaseWebsocketGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(BaseWebsocketGateway.name);

  constructor(private readonly moduleRef: ModuleRef) {}

  @SubscribeMessage('ping')
  handleMessage(client: Socket, payload: string): void {
    console.log(
      `Received message from ${client.id} with protocol ${client.conn.protocol}: ${payload}`,
    );
    this.server.emit(
      'message',
      `Message from ${client.id} with protocol ${client.conn.protocol}: ${payload}`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: any, ..._args: any[]) {
    // this.server.emit('connected', `Client connected: ${client.id}`);
    const parsedUrl = parse(client.handshake.url, true);
    const path = parsedUrl.pathname;

    const controllers = this.moduleRef.get<string[]>(SocketPath);

    this.logger.debug(controllers);
    const controllerPath = controllers.find((controllerPath) =>
      path.startsWith(controllerPath),
    );

    if (controllerPath) {
      const controllerInstance = this.moduleRef.get(controllerPath);
      controllerInstance.handleConnection(client, parsedUrl.query, this.server);
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: any) {
    this.server.emit('disconnected', `Client disconnected: ${client.id}`);
  }
}
