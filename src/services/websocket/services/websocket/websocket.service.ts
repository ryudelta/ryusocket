import { Injectable, Logger } from '@nestjs/common';
import { messageToStream } from '@utils/index';
import { WebSocket } from 'ws';

@Injectable()
export class WebsocketService {
  private logger = new Logger(WebsocketService.name);
  private subscriptions: Map<
    string,
    Set<{ clientId: string; client: WebSocket }>
  > = new Map();

  subscribeToStream(client: WebSocket, clientId: string, streams: string[]) {
    streams.forEach((stream) => {
      if (!this.subscriptions.has(stream)) {
        this.subscriptions.set(stream, new Set());
      }

      this.subscriptions.get(stream).add({ clientId, client: client });
    });

    console.log(this.subscriptions);
    
  }

  unsubscribeFromStream(client: WebSocket) {
    this.subscriptions.forEach((clients) => {
      clients.forEach((clientData) => {
        if (clientData.clientId === client['clientId']) {
          this.logger.debug(`client ${client['clientId']} deleted`);
          const deletedClient = clients.delete(clientData);
          this.logger.debug(deletedClient);
        }
      });
    });
  }

  closeConnection(client: WebSocket) {
    this.subscriptions.forEach((clients) => {
      clients.forEach((clientData) => {
        if (client.clientId === client['clientId']) {
          clientData.client.close();
          clients.delete(clientData);
        }
      });
    });
  }

  broadcastToStream(stream: string, message: any) {
    const clients = this.subscriptions.get(stream);
    const buildMessage = messageToStream(stream, message);
    if (clients) {
      clients.forEach((clientData) => {
        const { client } = clientData;
        client.send(JSON.stringify(buildMessage));
      });
    }
  }
}
