import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '../services/authenticationService';
import { AuthenticatedUser } from '../models/authenticatedUser';
import { Logger } from '../services/logger.service';
import { ResponseResult } from '../models/ResponseResult';
import { eResult } from '../common/enums';

export const authenticateTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const tAuthenticatedUser: AuthenticatedUser = await AuthenticationService.verfiy(token);
        if (tAuthenticatedUser && tAuthenticatedUser.isValid()) {
            res.locals.user = tAuthenticatedUser;
            next();
        } else {
            res.status(401).json(new ResponseResult(eResult.Error, 'Not Authenticated', null));
            return;
        }
    } catch (error) {
        Logger.log(error);
        return;
    }

};
