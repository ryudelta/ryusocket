import { Logger } from '@nestjs/common';
import { SocketPath } from '@utils/header';
import { Server, Socket } from 'socket.io';
import { WebsocketService } from '../services/websocket/websocket.service';
import { headerValidate } from '@utils/index';
import { JwtUtils } from '@utils/jwt/verify.jtwt';
import { ConfigService } from '@nestjs/config';
import { KeyUtils } from '../../../utils/key/key.jwt';

@SocketPath('private')
export class PrivateGatewayController {
  private readonly logger = new Logger(PrivateGatewayController.name);
  private algorithm: string = '';
  private jwtPayload: any;
  private jwtutils: any;

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly configService: ConfigService,
    private readonly keyUtils: KeyUtils
  ) {
    const { algorithm } = this.configService.get('jwt')
    this.algorithm = algorithm;
    this.jwtutils = new JwtUtils(this.keyUtils, this.configService);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: Socket, queryParams: any, server: Server) {
    const validate = headerValidate(client, 'authorization');
    let message: any = '';
    if (!validate) {
      message = {
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

    const parsingJwtPayload = await this.verifyJwt(client);
    
    if (!parsingJwtPayload){
      message = {
        failed: {
          message: 'subcribed',
          scope: 'private',
          reason: 'invalid jwt',
        },
      };

      this.websocketService.closeConnection(client);
      client.send(JSON.stringify(message));
      return;
    }

    client['clientId'] = parsingJwtPayload['uid'];

    if (queryParams){
      const parsingSubscribeParams = this.parsingStreamUser(queryParams, parsingJwtPayload);
      this.websocketService.subscribeToStream(
        client,
        client['clientId'],
        parsingSubscribeParams,
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

  async verifyJwt(client: Socket){
    let decodeVerify = '';
    if(this.algorithm == 'RS256') {
      decodeVerify = await this.jwtutils.RS256(client['authorization']);
      
      if(!decodeVerify){
        return false;
      }
    }else{
      decodeVerify = await this.jwtutils.customAlgoritm(client['authorization'], this.algorithm);
      if(!decodeVerify){
        return false;
      }
    }

    return decodeVerify;
  }

  private parsingStreamUser(source: string[], auth: any): string[] {
    const parsingdata: string[] = [];
    
    source.map((text) => {
      if (text.startsWith('account')){
          const replaceText = text.replace('account', auth['uid']);
          parsingdata.push(replaceText);
      }else{
        parsingdata.push(text);
      }
    });
    return parsingdata;
  }
}
