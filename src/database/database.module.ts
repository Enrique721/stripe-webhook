import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import configuration from 'src/configuration/configuration';

@Module({
    imports: [

        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            ignoreEnvFile: process.env.PRODUCTION ? true : false,
        }),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const mongooseConfig: MongooseModuleFactoryOptions = {
                    uri: configService.get<string>("databases.dash.url"),
                    authSource: "admin",
                };

                if (process.env.PRODUCTION) {
                    mongooseConfig.authMechanism = "DEFAULT";
                    mongooseConfig.auth = {
                        password: configService.get<string>("databases.dash.pass"),
                        username: configService.get<string>("databases.dash.user"),
                    };
                }
                return mongooseConfig;
            },
            connectionName: "Dash",
            inject: [ConfigService],
        }),
    ],
    providers: [],
    controllers: [],
})
export class DatabaseModule {

}
