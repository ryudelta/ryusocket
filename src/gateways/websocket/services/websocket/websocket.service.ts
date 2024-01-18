import { Injectable, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';

@Injectable()
export class WebsocketService {
  private logger = new Logger(WebsocketService.name);
  private subscriptions: Map<string, Set<WebSocket>> = new Map();

  subscribeToStream(client: WebSocket, stream: string) {
    if (!this.subscriptions.has(stream)) {
      this.subscriptions.set(stream, new Set());
    }

    this.subscriptions.get(stream).add(client);
    // console.log(this.subscriptions);
    console.log('===================');
  }

  unsubscribeFromStream(client: WebSocket) {
    this.logger.log(client['clientId']);
    const subscriptions = this.subscriptions.get(client['clientId']);

    console.log(this.subscriptions);

    this.logger.log(this.subscriptions);
    if (subscriptions) {
      subscriptions.delete(client);
    }
  }

  broadcastToStream(stream: string, message: any) {
    const clients = this.subscriptions.get(stream);

    if (clients) {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }
}
