import accountabilityController from '../controllers/Accountability/AccountabilityController';

const path = '/accountability';
export function router(app: any) {
  app.get(`${path}`, async (request: any, response: any, next: any) => {
    const accountability = new accountabilityController();

    try {
      const groceryData = await accountability.accountability(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/add`, async (request: any, response: any, next: any) => {
    const accountability = new accountabilityController();

    try {
      const groceryData = await accountability.addAccountability(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });
}
