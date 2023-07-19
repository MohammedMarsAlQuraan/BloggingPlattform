import express from 'express';
import { Express, Request, Response } from 'express';
import BlogRoutes from './routes/blog';
import UserRoutes from './routes/user';
import { DatabaseService } from './database/databaseService';
import { Logger } from './services/logger.service';


export class App {

  public static async InitializeApp() {
    const app: Express = express();
    const port = process.env.PORT || 3000;
    await DatabaseService.start();
    BlogRoutes.initializeRoutes();
    UserRoutes.initializeRoutes();
    app.use('/blogs', BlogRoutes.getRouter());
    app.use('/auth', UserRoutes.getRouter());
    app.get('/', (req: Request, res: Response) => {
      res.send('Express + TypeScript Server');
    });
    app.listen(port, () => {
      Logger.log(`⚡️[server]: Server is running at http://localhost:${port}`)
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  }
}
(async () => {
  await App.InitializeApp()
})();
