import express, { Request, Response, Router } from 'express';
import { Blog } from '../models/blog';
import { BlogService } from '../services/blog.service';
import { authenticateTokenMiddleware } from '../middlewares/authentication';
import { AuthenticatedUser } from '../models/authenticatedUser';
import bodyParser from 'body-parser';
import { OrderByDirection, eResult } from '../common/enums';
import { Logger } from '../services/logger.service';
import { CommonMethod } from '../common/CommonMethod';
import { ResponseResult } from '../models/ResponseResult';

class BlogRoutes {
  private static router: Router = express.Router();

  public static async initializeRoutes(): Promise<void> {
    try {
      this.router.get('/', authenticateTokenMiddleware, this.getAllBlogs);
      this.router.get('/:id', authenticateTokenMiddleware, this.getBlogById);
      this.router.post('/', authenticateTokenMiddleware, bodyParser.json(), this.createBlog);
      this.router.put('/:id', authenticateTokenMiddleware, bodyParser.json(), this.updateBlog);
      this.router.delete('/:id', authenticateTokenMiddleware, this.deleteBlog);
    } catch (error) {
      Logger.log(error);;
    }
  }

  private static async getAllBlogs(req: Request, res: Response): Promise<void> {
    try {
      const { orderByDirection, orderby, offset, limit } = req.query;
      const tAuthUser = res.locals?.user ? res.locals?.user : null;
      if (!tAuthUser) {
        res.status(401).json(new ResponseResult(eResult.Error, 'Not Authenticated', null));
        return;
      }
      let tOrderByDirection: OrderByDirection;
      let tOrderby: string = orderby ? orderby.toString() : '';
      if (orderByDirection) {
        if (orderByDirection.toString().toLowerCase() === 'asc') {
          tOrderByDirection = OrderByDirection.Asc;
        } else if (orderByDirection.toString().toLowerCase() === 'desc') {
          tOrderByDirection = OrderByDirection.Desc;
        }
      }
      let tOffset = -1;
      let tLimit = -1;
      if (offset != undefined && limit != undefined) {
        tOffset = parseInt(offset.toString());
        tLimit = parseInt(limit.toString());
      }
      const tAuthinticatedUser: AuthenticatedUser = new AuthenticatedUser(tAuthUser.id, tAuthUser.username);
      const tBlogs = await BlogService.GetAllBlogs(tAuthinticatedUser.id, tOrderby, tOrderByDirection, tOffset, tLimit);
      if (tBlogs) {
        res.json(new ResponseResult(eResult.Success, '', tBlogs));
        return;
      } else {
        res.json(new ResponseResult(eResult.Error, 'There is no item found', null));
        return;
      }
    } catch (error) {
      Logger.log(error);;
      res.status(500).json(new ResponseResult(eResult.Error, error, null));
      return;
    }
  }

  private static async getBlogById(req: Request, res: Response): Promise<void> {
    try {
      const tAuthUser = res.locals?.user ? res.locals?.user : null;
      if (!tAuthUser) {
        res.status(401).json(new ResponseResult(eResult.Error, 'Not Authenticated', null));
        return;
      }
      const tAuthinticatedUser: AuthenticatedUser = new AuthenticatedUser(tAuthUser.id, tAuthUser.username);
      const blogId: number = parseInt(req.params.id);
      const tBlog: Blog = await BlogService.GetBlogByID(tAuthinticatedUser.id, blogId);
      if (tBlog) {
        res.json(new ResponseResult(eResult.Success, '', tBlog));
        return;
      } else {
        res.json(new ResponseResult(eResult.Error, 'Item not found', null));
        return;
      }
    } catch (error) {
      Logger.log(error);
      res.status(500).json(new ResponseResult(eResult.Error, error, null));
      return;
    }

  }

  private static async createBlog(req: Request, res: Response): Promise<void> {
    try {
      const tAuthUser = res.locals?.user ? res.locals?.user : null;
      if (!tAuthUser) {
        res.status(401).json(new ResponseResult(eResult.Error, 'Not Authenticated', null));
        return;
      }
      const tAuthinticatedUser: AuthenticatedUser = new AuthenticatedUser(tAuthUser.id, tAuthUser.username);
      const tBody = req.body;
      if (!tBody || CommonMethod.isStringEmptyOrUndefiend(tBody.title)) {
        res.status(500).json(new ResponseResult(eResult.Error, 'The title should be filled', null));
        return;
      }
      if (!tBody || CommonMethod.isStringEmptyOrUndefiend(tBody.content)) {
        res.status(500).json(new ResponseResult(eResult.Error, 'The content should be filled', null));
        return;
      }
      const tBlog = new Blog(tBody.title, tBody.content, tAuthinticatedUser.id);
      const tResult = await BlogService.CreateBlog(tBlog);
      if (tResult === eResult.Success) {
        res.json(new ResponseResult(eResult.Success, 'Create a new blog', tBlog));
        return;
      } else {
        res.json(new ResponseResult(tResult, 'Blog not created successfully', null));
        return;
      }

    } catch (error) {
      Logger.log(error);
      res.status(500).json(new ResponseResult(eResult.Error, error, null));
      return;
    }
  }

  private static async updateBlog(req: Request, res: Response): Promise<void> {
    try {
      const tAuthUser = res.locals?.user ? res.locals?.user : null;
      if (!tAuthUser) {
        res.status(401).json(new ResponseResult(eResult.Error, 'Not Authenticated', null));
        return;
      }
      const tAuthinticatedUser: AuthenticatedUser = new AuthenticatedUser(tAuthUser.id, tAuthUser.username);
      const tBody = req.body;
      if (!tBody || CommonMethod.isStringEmptyOrUndefiend(tBody.title)) {
        res.json(new ResponseResult(eResult.Error, 'The title should be filled', null));
        return;
      }
      if (!tBody || CommonMethod.isStringEmptyOrUndefiend(tBody.content)) {
        res.json(new ResponseResult(eResult.Error, 'The content should be filled', null));
        return;
      }
      const tBlog = new Blog(tBody.title, tBody.content, tAuthinticatedUser.id);
      const tBlogId: number = parseInt(req.params.id);
      const tResult: eResult = await BlogService.UpdateBlog(tBlogId, tAuthinticatedUser.id, tBlog);
      if (tResult === eResult.Success) {
        res.json(new ResponseResult(tResult, `Blog with ID (${tBlogId}) Updated`, null));
        return;
      } else if (tResult === eResult.Error) {
        res.json(new ResponseResult(tResult, `Faild to update blog with ID (${tBlogId})`, null));
        return;
      } else {
        res.json(new ResponseResult(tResult, `The Blog Not Found`, null));
        return;
      }
    } catch (error) {
      Logger.log(error);
      res.status(500).json(new ResponseResult(eResult.Error, error, null));
      return;
    }
  }

  private static async deleteBlog(req: Request, res: Response): Promise<void> {
    try {
      const tAuthUser = res.locals?.user ? res.locals?.user : null;
      if (!tAuthUser) {
        res.status(401).json(new ResponseResult(eResult.Error, 'Not Authenticated', null));
        return;
      }
      const tAuthinticatedUser: AuthenticatedUser = new AuthenticatedUser(tAuthUser.id, tAuthUser.username);
      const tBlogId: number = parseInt(req.params.id);
      const tResult: eResult = await BlogService.DeleteBlog(tBlogId, tAuthinticatedUser.id);
      if (tResult === eResult.Success) {
        res.json(new ResponseResult(tResult, `Blog with ID (${tBlogId}) Deleted`, null));
        return;
      } else if (tResult === eResult.Error) {
        res.json(new ResponseResult(tResult, `Faild to delete blog with ID (${tBlogId})`, null));
        return;
      } else {
        res.status(401).json(new ResponseResult(tResult, 'NOT Authorized', null));
        return;
      }
    } catch (error) {
      Logger.log(error);
      res.status(500).json(new ResponseResult(eResult.Error, error, null));
      return;
    }
  }

  public static getRouter(): Router {
    return this.router;
  }
}

export default BlogRoutes;
