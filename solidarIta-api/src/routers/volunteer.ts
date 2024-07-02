import VolunteerController from '../controllers/Volunteer/VolunteerController';

const path = '/volunteer';
export function router(app: any) {
  app.post(`${path}`, async (request: any, response: any, next: any) => {
    const volunteer = new VolunteerController();

    try {
      const volunteerData = await volunteer.getVolunteers(request, response);
      response.json(volunteerData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/getOne`, async (request: any, response: any, next: any) => {
    const volunteer = new VolunteerController();

    try {
      const volunteerData = await volunteer.getOneVolunteer(request, response);
      response.json(volunteerData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/add`, async (request: any, response: any, next: any) => {
    const volunteer = new VolunteerController();

    try {
      const volunteerData = await volunteer.AddVolunteer(request, response);
      response.json(volunteerData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/changeStatus`, async (request: any, response: any, next: any) => {
    const volunteer = new VolunteerController();

    try {
      const volunteerData = await volunteer.ChangeStatus(request, response);
      response.json(volunteerData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/scheduleOrder`, async (request: any, response: any, next: any) => {
    const volunteer = new VolunteerController();

    try {
      const volunteerData = await volunteer.ScheduleOrder(request, response);
      response.json(volunteerData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/subscribe`, async (request: any, response: any, next: any) => {
    const volunteer = new VolunteerController();

    try {
      const volunteerData = await volunteer.Subscribe(request, response);
      response.json(volunteerData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/unsubscribe`, async (request: any, response: any, next: any) => {
    const volunteer = new VolunteerController();

    try {
      const volunteerData = await volunteer.Unsubscribe(request, response);
      response.json(volunteerData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/delete`, async (request: any, response: any, next: any) => {
    const volunteer = new VolunteerController();

    try {
      const volunteerData = await volunteer.deleteVolunteer(request, response);
      response.json(volunteerData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/edit`, async (request: any, response: any, next: any) => {
    const volunteer = new VolunteerController();

    try {
      const volunteerData = await volunteer.EditVolunteer(request, response);
      response.json(volunteerData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/donorHistory`, async (request: any, response: any, next: any) => {
    const volunteer = new VolunteerController();

    try {
      const volunteerData = await volunteer.getHistoryDonorVolunteer(request, response);
      response.json(volunteerData);
    } catch (error: any) {
      next(error);
    }
  });
}
