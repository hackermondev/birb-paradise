import { ApplicationCommandRegistry, ILogger, SapphireClient, StoreRegistry } from '@sapphire/framework';
import Redis, { RedisCommander } from 'ioredis';
import { Leaderboard } from '../leaderboard';
import { Perspective } from '../perspective';
import { Tasks } from '../tasks';
import { Utility } from '../utility';
import { Leaderboard } from '../leaderboard';
import { Economy } from '../economy';
import Statcord from "statcord.js" 

declare module '@sapphire/pieces' {
    interface Container {
        client: SapphireClient;
        utility: Utility;
        redis: RedisCommander;
        perspective: Perspective;
        leaderboard: Leaderboard;
        economy: Economy;
        statcord: Statcord.Client;
        tasks: Tasks;
        stores: StoreRegistry;
	    logger: ILogger;
	    applicationCommandRegistries: ApplicationCommandRegistry;
    }
}
