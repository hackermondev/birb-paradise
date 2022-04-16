import { ApplicationCommandRegistry, ILogger, SapphireClient, StoreRegistry } from '@sapphire/framework';
import Redis, { RedisCommander } from 'ioredis';
import { Utility } from './utility';
declare module '@sapphire/pieces' {
    interface Container {
        client: SapphireClient;
        utility: Utility;
        redis: RedisCommander;
        stores: StoreRegistry;
	    logger: ILogger;
	    applicationCommandRegistries: ApplicationCommandRegistry;
    }
}
