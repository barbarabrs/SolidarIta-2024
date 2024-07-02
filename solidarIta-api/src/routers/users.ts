import UsersController from '../controllers/User/UsersController';

const path = '/user';
export function router(app: any) {
  app.post(`${path}`, async (request: any, response: any, next: any) => {
    const user = new UsersController();

    try {
      const userData = await user.getUsers(request, response);
      response.json(userData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/list`, async (request: any, response: any, next: any) => {
    const user = new UsersController();

    try {
      const userData = await user.getUsersList(request, response);
      response.json(userData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/create`, async (request: any, response: any, next: any) => {
    const user = new UsersController();
    let ret = null;
    try {
      const userData = await user.createUser(request, response);
      return userData;
    } catch (error: any) {
      ret = error;
    }
    next(ret);
  });

  app.post(`${path}/edit`, async (request: any, response: any, next: any) => {
    const user = new UsersController();

    try {
      const userData = await user.editUser(request, response);
      response.json(userData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/delete`, async (request: any, response: any, next: any) => {
    const user = new UsersController();

    try {
      const userData = await user.deleteUser(request, response);
      response.json(userData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/checkPassword`, async (request: any, response: any, next: any) => {
    const user = new UsersController();

    try {
      const userData = await user.checkPassword(request, response);
      response.json(userData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/verify`, async (request: any, response: any, next: any) => {
    const user = new UsersController();

    try {
      const userData = await user.verify(request, response);
      response.json(userData);
    } catch (error: any) {
      next(error);
    }
  });
}
