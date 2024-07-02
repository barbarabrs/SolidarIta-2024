import LoginController from '../controllers/User/LoginController';

const path = '/login';
export function router(app: any) {
  //   app.post(`${path}`, Login.auth);

  app.post(`${path}`, async (request: any, response: any, next: any) => {
    const login = new LoginController();

    let ret = null;
    try {
      const auth = await login.auth(request, response);
      return auth;
    } catch (error: any) {
      ret = error;
    }
    next(ret);
  });
}
