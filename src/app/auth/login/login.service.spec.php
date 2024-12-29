
import { RegisterService } from 'src/app/auth/register/register.service';
import { UsersService } from '../..';
import { AuthController } from '../auth.controller';
import { LoginService } from './login.service';
import { ObjectId } from 'mongodb';
import { LoginDTO } from 'src/app/auth/dto';
describe('CatsController', () => {
  let authController: AuthController;
  let loginService: LoginService;
  let userService: UsersService;
  let registerService: RegisterService;

  beforeEach(() => {
    loginService = new LoginService(userService, registerService);
    authController = new AuthController(registerService, loginService);
  });

  describe('login', () => {
    it('should return an object of user data and access token and refresh token', async () => {
      const loginDto: LoginDTO = {
        email: 'test',
        password: 'test',
      };
      const loginResponse = {
        user: {
          sub: new ObjectId('sub'),
          name: 'name',
          isMentor: true,
          email: 'email',
          role: 'role',
          image: 'image',
        },
        token: {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      };

      expect(await authController.login(loginDto)).toBe(loginResponse);
    });
  });
});
