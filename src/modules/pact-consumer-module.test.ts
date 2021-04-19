import { Test, TestingModule } from '@nestjs/testing';
import { Auth0OpenidConenctModule } from 'src/modules/auth0-open-id.conenct';
import {
  PactConsumerOptionsFactory,
  PactConsumerOverallOptions,
} from '../interfaces/pact-consumer-module-options.interface';
import { PactFactory } from '../services/pact-factory.service';
import { PactModuleProviders } from '../common/pact-module-providers.enum';

describe("Given a 'PactConsumerModule' module", () => {
  const config: PactConsumerOverallOptions = {
    consumer: {
      host: 'http://beverly-hills.com',
      port: 90210,
    },
    publication: {
      pactFilesOrDirs: [],
      pactBroker: 'snoop-dog',
      consumerVersion: 'california-2.0',
    },
  };

  class PactConsumerConfigTestService implements PactConsumerOptionsFactory {
    createPactConsumerOptions(): PactConsumerOverallOptions {
      return config;
    }
  }

  describe("when calling the 'register' method", () => {
    let moduleRef: TestingModule;

    beforeAll(async () => {
      moduleRef = await Test.createTestingModule({
        imports: [Auth0OpenidConenctModule.register(config)],
      }).compile();
    });

    test('then provide PactFactory service', async () => {
      const pactFactory = moduleRef.get(PactFactory);
      expect(pactFactory).toBeDefined();
    });

    test('then provide Publisher provider', async () => {
      const publisher = moduleRef.get(PactModuleProviders.PactPublisher);
      expect(publisher).toBeDefined();
    });
  });

  describe("when calling the 'registerAsync' method", () => {
    let moduleRef: TestingModule;

    beforeAll(async () => {
      moduleRef = await Test.createTestingModule({
        imports: [
          Auth0OpenidConenctModule.registerAsync({
            useFactory: () => config,
          }),
        ],
      }).compile();
    });

    describe("and the 'useFactory' option is used", () => {
      test('then provide PactFactory service', async () => {
        const pactFactory = moduleRef.get(PactFactory);
        expect(pactFactory).toBeDefined();
      });

      test('then provide Publisher provider', async () => {
        const publisher = moduleRef.get(PactModuleProviders.PactPublisher);
        expect(publisher).toBeDefined();
      });
    });

    describe("and the 'useClass' option is used", () => {
      let moduleRef: TestingModule;

      beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
          imports: [
            Auth0OpenidConenctModule.registerAsync({
              useClass: PactConsumerConfigTestService,
            }),
          ],
        }).compile();
      });

      test('then provide PactFactory service', async () => {
        const pactFactory = moduleRef.get(PactFactory);
        expect(pactFactory).toBeDefined();
      });

      test('then provide Publisher provider', async () => {
        const publisher = moduleRef.get(PactModuleProviders.PactPublisher);
        expect(publisher).toBeDefined();
      });
    });
  });
});
