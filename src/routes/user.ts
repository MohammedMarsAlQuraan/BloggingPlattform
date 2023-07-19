import express, { Request, Response, Router } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { UserService } from '../services/userService';
import bodyParser from 'body-parser';
import { AuthenticationService } from '../services/authenticationService';
import { AuthenticatedUser } from '../models/authenticatedUser';
import { Logger } from '../services/logger.service';
import { eResult } from '../common/enums';
import { ResponseResult } from '../models/ResponseResult';
import { CommonMethod } from '../common/CommonMethod';
class UserRoutes {
  private static router: Router = express.Router();

  public static async initializeRoutes(): Promise<void> {
    this.router.post('/login', bodyParser.json(), this.login);
    this.router.post('/register', bodyParser.json(), this.register);
  }

  public static getRouter(): Router {
    return this.router;
  }

  private static async login(req: Request, res: Response): Promise<void> {
    try {
      const tUserName: string = req.body['Username'];
      const tUser: User = await UserService.Login(tUserName);
      const tBody = req.body;
      if (!tBody || CommonMethod.isStringEmptyOrUndefiend(tBody.Username)) {
        res.status(500).json(new ResponseResult(eResult.Error, 'The username should be filled', null));
        return;
      }
      if (!tBody || CommonMethod.isStringEmptyOrUndefiend(tBody.Password)) {
        res.status(500).json(new ResponseResult(eResult.Error, 'The password should be filled', null));
        return;
      }
      if (tUser) {
        const tPassword: string = req.body['Password'];
        const tIsMatch = bcrypt.compareSync(tPassword, tUser.password);
        if (tIsMatch) {
          const tToken = AuthenticationService.generateToken(tUser.id, tUser.username);
          res.json(new ResponseResult(eResult.Success, '', { userId: tUser.id, token: tToken }));
          return;
        }
      }
      res.json(new ResponseResult(eResult.Success, 'Username or Password is not correct', null));
      return;
    } catch (error) {
      Logger.log(error);
      res.json(new ResponseResult(eResult.Error, error, null));
      return;
    }
  }

  private static async register(req: Request, res: Response): Promise<void> {
    try {
      const tUserName: string = req.body['Username'];
      const tPassword: string = await bcrypt.hash(req.body['Password'], 8);
      const tUser: User = new User(tUserName, tPassword);

      const tBody = req.body;
      if (!tBody || CommonMethod.isStringEmptyOrUndefiend(tBody.Username)) {
        res.status(500).json(new ResponseResult(eResult.Error, 'The username should be filled', null));
        return;
      }
      if (!tBody || CommonMethod.isStringEmptyOrUndefiend(tBody.Password)) {
        res.status(500).json(new ResponseResult(eResult.Error, 'The password should be filled', null));
        return;
      }

      const tIsUserExisit: boolean = await UserService.isUserExisit(tUserName);
      if (tIsUserExisit) {
        res.status(500).json(new ResponseResult(eResult.Error, 'Username is already exisit', null));
        return;
      }
      const tResult: eResult = await UserService.Register(tUser);
      if (tResult === eResult.Success) {
        res.json(new ResponseResult(tResult, 'User Created Successfully', null));
        return;
      } else {
        res.json(new ResponseResult(tResult, 'Somthing Went Wrong', null));
        return;
      }
    } catch (error) {
      Logger.log(error);
      res.json(new ResponseResult(eResult.Error, error, null));
      return;

    }

  }
}

export default UserRoutes;
