import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let appController: AppController;
    let appService: AppService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
        appService = app.get<AppService>(AppService);
    });

    describe('healthCheckUp', () => {
        it('should return "Muse backend is running!"', () => {
            jest.spyOn(appService, 'healthCheckUp').mockImplementation(() => 'Muse backend is running!');
            expect(appController.healthCheckUp()).toBe('Muse backend is running!');
        });
    });
});