import { AuthenticatedUser } from "../models/authenticatedUser";
import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiration } from '../../config/authConfig';
import { Logger } from "./logger.service";

export class AuthenticationService {


    public static verfiy(pToken: string): Promise<AuthenticatedUser> {
        return new Promise<AuthenticatedUser>((resolve, reject) => {
            try {
                jwt.verify(pToken, jwtSecret, (err, decoded: any | undefined) => {
                    if (err) {
                        Logger.log(err);
                        resolve(null);
                        return;
                    }
                    if (decoded) {
                        const tAuthenticatedUser: AuthenticatedUser = new AuthenticatedUser(decoded._id, decoded.name);
                        resolve(tAuthenticatedUser);
                        return;
                    }
                });
                resolve(null);
                return;
            } catch (error) {
                Logger.log(error);;
                resolve(null);
                return;
            }
        })
    }

    public static generateToken(pUserId: number, pUsername: string): string {
        try {
            if (pUserId != -1 && pUsername) {
                const token = jwt.sign({ _id: pUserId?.toString(), name: pUsername }, jwtSecret, {
                    expiresIn: jwtExpiration,
                });
                return token;
            }
            return "";
        } catch (error) {
            Logger.log(error);;
            return "";
        }
    }
}