import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { randomInt } from 'crypto';

@Injectable()
export class RabbitmqService {

    private readonly logger = new Logger(this.constructor.name);
    private connection: amqp.Connection;
    private channel: amqp.Channel;
    private rabbitConfig: any;
    private queueName: string;
    
    afterInit() {
        this.logger.log('Rabbit amqp is running and stay for recieve message');
    }

    constructor(private readonly configService: ConfigService) {
        this.rabbitConfig = this.configService.get('rabbitmq');
        this.queueName = `rango.instance.${randomInt(10000000)}`;
    }

    public async connect() {
        await this.createRabbitConnection();
        try {
            this.channel = await this.connection.createChannel();
        } catch (error) {
            this.logger.error(`Error init channel for ranger`);
            this.logger.error(JSON.stringify(error));
        }
    }

    public async onApplicationBootstrap() {
        await this.connect();

        const { exName } = this.rabbitConfig;
        this.channel = await this.setupExchangeChannel(exName);

        this.consumeMessages((msg) => {
            this.logger.log(`Received message: ${JSON.stringify(msg.fields)}`);
            this.logger.log(`Received message: ${msg.content.toString()}`);
        });
    }

    public async consumeMessages(callback: (msg: amqp.ConsumeMessage) => void) {
        this.channel = await this.connection.createChannel();
        await this.channel.consume(this.queueName, callback, { noAck: true });

        this.logger.log(`Started consuming messages from queue: [*]`);
    }

    public async setupExchangeChannel(exchangeName: string) {
        await this.connect();

        await this.channel.assertExchange(exchangeName, 'topic', {
          durable: false,
          autoDelete: true,
        });

        await this.setupQueueChannel(exchangeName, this.channel);
    }

    public async setupQueueChannel(exchangeName: string, channel: amqp.Channel) {
        const assertedQueue = await channel.assertQueue(this.queueName, {
          durable: false,
          autoDelete: true,
        });
        
        if(channel){
            await channel.bindQueue(assertedQueue.queue, exchangeName, "#")
        }
        
    }

    public async createRabbitConnection() {
        try {
            const { host, port, user, pass } = this.rabbitConfig;

            this.connection = await amqp.connect(`amqp://${user}:${pass}@${host}:${port}`);
        
            this.connection.on('error', (error: any) => {
                this.logger.error(`Error connection to rabbitmq: ${JSON.stringify(error)}`);
            });
        
            this.connection.on('close', () => {
                this.logger.warn('Connection to rabbitmq is closed');
            });
        
            this.logger.log('Connection to rabbitmq is established');
        }
        catch (error) {
          this.logger.error(`Error connection to rabbitmq: ${error}`);
        }
    }
}
