import DonationController from '../controllers/Donation/DonationController';

const path = '/donation';
export function router(app: any) {
  app.post(`${path}`, async (request: any, response: any, next: any) => {
    const donation = new DonationController();

    try {
      const donationData = await donation.getDonations(request, response);
      response.json(donationData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/getOne`, async (request: any, response: any, next: any) => {
    const donation = new DonationController();

    try {
      const donationData = await donation.getOneDonation(request, response);
      response.json(donationData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/add`, async (request: any, response: any, next: any) => {
    const donation = new DonationController();

    try {
      const donationData = await donation.AddDonation(request, response);
      response.json(donationData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/changeStatus`, async (request: any, response: any, next: any) => {
    const donation = new DonationController();

    try {
      const donationData = await donation.ChangeStatus(request, response);
      response.json(donationData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/scheduleOrder`, async (request: any, response: any, next: any) => {
    const donation = new DonationController();

    try {
      const donationData = await donation.ScheduleOrder(request, response);
      response.json(donationData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/payment`, async (request: any, response: any, next: any) => {
    const donation = new DonationController();

    try {
      const donationData = await donation.Payment(request, response);
      response.json(donationData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/delete`, async (request: any, response: any, next: any) => {
    const donation = new DonationController();

    try {
      const donationData = await donation.deleteDonation(request, response);
      response.json(donationData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/edit`, async (request: any, response: any, next: any) => {
    const donation = new DonationController();

    try {
      const donationData = await donation.EditDonation(request, response);
      response.json(donationData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/donorHistory`, async (request: any, response: any, next: any) => {
    const donation = new DonationController();

    try {
      const donationData = await donation.getHistoryDonorDonation(request, response);
      response.json(donationData);
    } catch (error: any) {
      next(error);
    }
  });
}
