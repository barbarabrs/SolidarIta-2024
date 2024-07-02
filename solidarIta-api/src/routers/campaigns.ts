import CampaignsController from '../controllers/Campaigns/CampaignsController';

const path = '/campaigns';
export function router(app: any) {
  app.post(`${path}`, async (request: any, response: any, next: any) => {
    const campaign = new CampaignsController();

    try {
      const groceryData = await campaign.getActiveCampaigns(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/history`, async (request: any, response: any, next: any) => {
    const campaign = new CampaignsController();

    try {
      const groceryData = await campaign.getCampainsHistory(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/finished`, async (request: any, response: any, next: any) => {
    const campaign = new CampaignsController();

    try {
      const groceryData = await campaign.getCampainsFinished(request, response);
      response.json(groceryData);
    } catch (error: any) {
      next(error);
    }
  });
}
