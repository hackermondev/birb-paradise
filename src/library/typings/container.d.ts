import { ApplicationCommandRegistry, ILogger, SapphireClient, StoreRegistry } from '@sapphire/framework';
import Redis, { RedisCommander } from 'ioredis';
import { Leaderboard } from '../leaderboard';
import { Perspective } from '../perspective';
import { Utility } from '../utility';
declare module '@sapphire/pieces' {
    interface Container {
        client: SapphireClient;
        utility: Utility;
        redis: RedisCommander;
        perspective: Perspective;
        leaderboard: Leaderboard;
        stores: StoreRegistry;
	    logger: ILogger;
	    applicationCommandRegistries: ApplicationCommandRegistry;
    }
}
