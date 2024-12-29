// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { LoginService } from './login/login.service';
// import { LoginDTO } from './dto/index';

// describe('AuthController', () => {
//   let authController: AuthController;
//   let authService: LoginService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [LoginService],
//     }).compile();

//     authController = module.get<AuthController>(AuthController);
//     authService = module.get<LoginService>(LoginService);
//   });

//   describe('login', () => {
//     it('should return an access token', async () => {
//       const result = { accessToken: 'someAccessToken' };
//       const loginDto: LoginDTO = { email: 'testuser', password: 'testpassword' };

//       jest.spyOn(authService, 'login').mockImplementation(async () => result);

//       expect(await authController.login(loginDto)).toBe(result);
//     });
//   });
// });