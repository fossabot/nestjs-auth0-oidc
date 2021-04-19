import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import {
  PactConsumerModuleAsyncOptions,
  PactConsumerOptionsFactory,
  PactConsumerOverallOptions,
} from '../interfaces/pact-consumer-module-options.interface';
import { PactProvider } from '../providers/pact.provider';
import { PactFactory } from '../services/pact-factory.service';
import { PactModuleProviders } from '../common/pact-module-providers.enum';
import { ProviderFactory } from '../common/provider-factory';
import { PactPublisherProvider } from '../providers/pact-publisher.provider';

@Module({})
export class Auth0OpenIdConnectCoreModule {
  public static register(options: PactConsumerOverallOptions): DynamicModule {
    const consumerOptProvider = ProviderFactory.create(PactModuleProviders.ConsumerOptions, options.consumer);
    const publisherOptProvider = ProviderFactory.create(PactModuleProviders.PublicationOptions, options.publication);

    return {
      module: Auth0OpenIdConnectCoreModule,
      exports: [PactFactory, PactPublisherProvider],
      providers: [consumerOptProvider, publisherOptProvider, PactProvider, PactPublisherProvider, PactFactory],
    };
  }

  public static registerAsync(options: PactConsumerModuleAsyncOptions): DynamicModule {
    return {
      module: Auth0OpenIdConnectCoreModule,
      exports: [PactFactory, PactPublisherProvider],
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), PactProvider, PactPublisherProvider, PactFactory],
    };
  }

  private static createAsyncProviders(options: PactConsumerModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return this.createAsyncOptionsProviders(options);
    }

    const { useClass } = options;

    return [
      ...this.createAsyncOptionsProviders(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProviders(options: PactConsumerModuleAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: PactModuleProviders.ConsumerOptions,
          useFactory: async () => {
            const { consumer } = await options.useFactory();
            return consumer;
          },
          inject: options.inject || [],
        },
        {
          provide: PactModuleProviders.PublicationOptions,
          useFactory: async () => {
            const { publication } = await options.useFactory();
            return publication;
          },
          inject: options.inject || [],
        },
      ];
    }

    const inject = [(options.useClass || options.useExisting) as Type<PactConsumerOverallOptions>];

    return [
      {
        provide: PactModuleProviders.ConsumerOptions,
        useFactory: async (optionsFactory: PactConsumerOptionsFactory) => {
          const { consumer } = await optionsFactory.createPactConsumerOptions();

          return consumer;
        },
        inject,
      },
      {
        provide: PactModuleProviders.PublicationOptions,
        useFactory: async (optionsFactory: PactConsumerOptionsFactory) => {
          const { publication } = await optionsFactory.createPactConsumerOptions();

          return publication;
        },
        inject,
      },
    ];
  }
}
