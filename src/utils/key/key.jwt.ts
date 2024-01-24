import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class KeyUtils {
    private readonly logger = new Logger(this.constructor.name);
    private key: string;

    constructor(private readonly configService: ConfigService){
        const { key } = this.configService.get('jwt')
        this.key = key;
    }

    public async dataKey(buffer: boolean): Promise<Buffer | string>{
        try {
            if (buffer){
                const key = Buffer.from(this.key, 'base64');
                return key;
            }else{
                return this.key;
            }
        } catch (error) {
            this.logger.error(`Key is invalid`);
        }
    }
}