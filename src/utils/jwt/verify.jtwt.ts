import { Injectable, Logger, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config";
import { KeyUtils } from "@utils/key/key.jwt";
import * as jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtUtils implements jwt {
    private readonly logger = new Logger(this.constructor.name);
    private algorithm: string = '';

    constructor(
        private readonly keyUtils: KeyUtils,
        private readonly configService: ConfigService,
    ){
        const { algorithm } = this.configService.get('jwt')
        this.algorithm = algorithm;
    }
    
    public async RS256(token: string): Promise<any>{
        const tokenData = this.parsingToken(token);
        try {
            const key = await this.keyUtils.dataKey(true);
            console.log(key);
            
            const decode = await jwt.verify(tokenData, key, { algorithms: this.algorithm })
            return decode;
        } catch (error) {
            this.logger.error(`Jwt is invalid`)
            this.logger.error(error)
        }
    }

    public async customAlgoritm(token: string, algorithm: string): Promise<any> {
        const tokenData = this.parsingToken(token);
        try {
            const key = this.keyUtils.dataKey(false);
            const decode = await jwt.verify(tokenData, key, { algorithms: algorithm });
            return decode
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                this.logger.error(`Token has been expired`)
                throw new UnauthorizedException(
                  'Token has been expired',
                );
            }else if (error instanceof UnauthorizedException) {
                this.logger.error(error)
                throw error;
            }
        }
    }

    private parsingToken(token: string): string {
        const tokenArray = token.split(' ');
        return tokenArray[1];
    }
}