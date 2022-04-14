import { ApplicationCommandRegistry, ILogger, SapphireClient, StoreRegistry } from '@sapphire/framework';
import { PrismaClient } from '@prisma/client';
import { Utility } from './utility';
declare module '@sapphire/pieces' {
    interface Container {
        client: SapphireClient;
        utility: Utility;
        db: PrismaClient;
        stores: StoreRegistry;
	    logger: ILogger;
	    applicationCommandRegistries: ApplicationCommandRegistry;
    }
}
