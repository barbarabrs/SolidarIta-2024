import GroceryListController from '../controllers/GroceryList/GroceryListController';

const path = '/groceryList';
export function router(app: any) {
  app.post(`${path}`, async (request: any, response: any, next: any) => {
    const grocery = new GroceryListController();

    try {
      const groceryData = await grocery.getGroceryLists(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/getOne`, async (request: any, response: any, next: any) => {
    const grocery = new GroceryListController();

    try {
      const groceryData = await grocery.getOneGroceryList(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/add`, async (request: any, response: any, next: any) => {
    const grocery = new GroceryListController();

    try {
      const groceryData = await grocery.AddGroceryList(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/changeStatus`, async (request: any, response: any, next: any) => {
    const grocery = new GroceryListController();

    try {
      const groceryData = await grocery.ChangeStatus(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/scheduleOrder`, async (request: any, response: any, next: any) => {
    const grocery = new GroceryListController();

    try {
      const groceryData = await grocery.ScheduleOrder(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/payment`, async (request: any, response: any, next: any) => {
    const grocery = new GroceryListController();

    try {
      const groceryData = await grocery.Payment(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/delete`, async (request: any, response: any, next: any) => {
    const grocery = new GroceryListController();

    try {
      const groceryData = await grocery.deleteGroceryList(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/edit`, async (request: any, response: any, next: any) => {
    const grocery = new GroceryListController();

    try {
      const groceryData = await grocery.EditGroceryList(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/donorHistory`, async (request: any, response: any, next: any) => {
    const grocery = new GroceryListController();

    try {
      const groceryData = await grocery.getHistoryDonorGroceryList(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });
}
