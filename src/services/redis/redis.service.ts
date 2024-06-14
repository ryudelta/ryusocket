import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly logger = new Logger(this.constructor.name);
    private redisConfig: any;
    private readonly redisClient: Redis;

    constructor(private readonly configService: ConfigService){
        this.redisConfig = this.configService.get('redis');
        this.redisClient = new Redis({
            host: this.redisConfig['host'],
            port: this.redisConfig['port'],
        });
    }

    async getValue(key: string): Promise<any | null> {
        const value = await this.redisClient.get(key);
        return value;
    }

    async setValue(key: string, value: any): Promise<void>{
        await this.redisClient.set(key, value);
    }

    async appendToArray(key: string, value: any): Promise<void> {
        await this.redisClient.rpush(key, value);
    }

    async setArrayValueAtIndex(key: string, index: number, value: any): Promise<void> {
        await this.redisClient.lset(key, index, value);
    }

    async delValueKey(key: string): Promise<number> {
        const result = await this.redisClient.del(key);
        return result;
    }

    async delValueAtKey(key: string, value: any): Promise<void> {
        const datas = await this.getValue(key);

        if (datas && Array.isArray(datas)){
            datas.map(async (data, index) => {
                if(data === value){
                    await this.redisClient.lrem(key, index, value);
                }
            })
        }
    }
}
