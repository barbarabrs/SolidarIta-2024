import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import moment from 'moment';
import { getManager } from 'typeorm';
import { connect } from '../../database/index';
import Controller from '../Controller';

connect();
const manager = getManager();
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string
  }
});

export default class VolunteerController extends Controller {
  async getVolunteers(request: Request, response: Response) {
    try {
      const { id, status } = request.body;

      // Verificar se o usuário existe
      let userQuery = manager
        .createQueryBuilder()
        .select([
          'volunteer.name as name',
          'volunteer.description',
          'volunteer.goal',
          'volunteer.place',
          'volunteer.schedule',
          'volunteer.image',
          'volunteer.accountability',
          'status_campain.description as status',
          'users.pix',
          'volunteer.id',
          'users.username'
        ])
        .from('volunteer', 'volunteer')
        .innerJoin('users', 'users', `volunteer.owner_id = users.id`)
        .innerJoin('status_campain', 'status_campain', `volunteer.status = status_campain.status`)
        .where(`volunteer.owner_id = ${parseInt(id)}`);
      if (status !== undefined) {
        userQuery = userQuery.andWhere(`volunteer.status = '${parseInt(status)}'`);
      }

      const volunteer = await userQuery.getRawMany();
      // Retornar o token como resposta
      if (volunteer) {
        return volunteer;
      }
      return [];
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação'
      });
    } finally {
      // await this.connection.closePortalpod();
    }
  }

  async getOneVolunteer(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { id, donor_id, owner, user_id, user_type } = request.body;

      // Verificar se o usuário existe
      let query = manager
        .createQueryBuilder()
        .select([
          'volunteer.name as name',
          'volunteer.description',
          'volunteer.goal',
          'volunteer.place',
          'volunteer.schedule',
          'volunteer.image',
          'volunteer.owner_id',
          'volunteer.accountability',
          'status_campain.description as status',
          'owner.username',
          'accountability.message as accountability_message'
        ])
        .from('volunteer', 'volunteer')
        .innerJoin('users', 'owner', 'volunteer.owner_id = owner.id')
        .innerJoin('status_campain', 'status_campain', `volunteer.status = status_campain.status`)
        .leftJoin('volunteer_subscribe', 'volunteer_subscribe', `volunteer.id = volunteer_subscribe.volunteer_id`)
        .leftJoin('accountability', 'accountability', `volunteer.id = accountability.volunteer_id`)
        .where(`volunteer.id = ${parseInt(id)}`);

      if (user_id) {
        if (user_type === 2) {
          query = query.andWhere(`volunteer.owner_id != ${parseInt(user_id)}`);
        }
      }

      if (donor_id) {
        query = query
          .andWhere(`volunteer.status IN ('1','2','3')`)
          .andWhere(`volunteer_subscribe.donor_id  = '${parseInt(donor_id)}'`);
      }

      if (owner) {
        query = query.andWhere(`owner.id = ${parseInt(owner)}`);
      }

      const volunteer = await query.getRawMany();
      // Retornar o token como resposta
      if (volunteer) {
        return volunteer;
      }
      return [];
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação'
      });
    } finally {
      // await this.connection.closePortalpod();
    }
  }

  async AddVolunteer(request: Request, response: Response) {
    try {
      interface volunteer {
        name: string;
        image: string;
        description: string;
        goal: string;
        place: string;
        schedule: string;
        owner_id: number;
      }

      const list: volunteer = request.body;
      const date = moment().format('YYYY-MM-DD');

      let imageUrl = '';
      if (list.image) {
        if (list.image.startsWith('https://solidarita')) {
          imageUrl = list.image;
        } else {
          const [_match, contentType, imageExtension] = list.image.match(
            /^data:([a-zA-Z0-9]+\/([a-zA-Z0-9-.+]+)).*,.*/i
          ) || ['', 'jpeg'];
          const base64Data = list.image.replace(/^data:image\/\w+;base64,/, '');
          // Decode the base64 string into a buffer
          const imageBuffer = Buffer.from(base64Data, 'base64');

          // Considerando que a imagem vem no body.image
          const bucketName = 'solidarita';
          const key = randomUUID() + '.' + imageExtension;
          const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: imageBuffer,
            ContentType: contentType,
            ACL: 'public-read'
          });

          try {
            const response = await s3Client.send(command);
            console.log(response);
          } catch (err) {
            console.error(err);
          }
          imageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
        }
      }

      const query = `
        INSERT INTO volunteer (name, description, image, goal, place, schedule, owner_id, status, date)
        VALUES ('${list.name}', '${list.description}', '${imageUrl}', '${list.goal}', '${list.place}', '${list.schedule}', ${list.owner_id}, 1, '${date}')
        RETURNING id; 
    `;

      // Execute a query e obtenha o ID retornado
      const result = await manager.query(query);
      const volunteer_id = result[0].id;

      return [];
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação'
      });
    } finally {
      // await this.connection.closePortalpod();
    }
  }
  async EditVolunteer(request: Request, response: Response) {
    try {
      interface volunteer {
        name: string;
        image: string;
        description: string;
        goal: string;
        place: string;
        schedule: string;
        id: string;
      }

      const list: volunteer = request.body;
      const date = moment().format('YYYY-MM-DD');

      let imageUrl;
      let imageUrlUpdate = '';
      if (list.image) {
        const [_match, contentType, imageExtension] = list.image.match(
          /^data:([a-zA-Z0-9]+\/([a-zA-Z0-9-.+]+)).*,.*/i
        ) || ['', 'jpeg'];
        const base64Data = list.image.replace(/^data:image\/\w+;base64,/, '');
        // Decode the base64 string into a buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Considerando que a imagem vem no body.image
        const bucketName = 'solidarita';
        const key = randomUUID() + '.' + imageExtension;
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: imageBuffer,
          ContentType: contentType,
          ACL: 'public-read'
        });

        try {
          const response = await s3Client.send(command);
          console.log(response);
        } catch (err) {
          console.error(err);
        }
        imageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
        imageUrlUpdate = imageUrl ? `, image = '${imageUrl}'` : '';
      }

      const query = `
      UPDATE volunteer
      SET name = '${list.name}',
          description = '${list.description}',
          place = '${list.place}',
          schedule = '${list.schedule}',
          date = '${date}'
          ${imageUrlUpdate}
      WHERE id = ${parseInt(list.id)}
    `;

      await manager.query(query);

      return [];
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação'
      });
    } finally {
      // await this.connection.closePortalpod();
    }
  }

  async ChangeStatus(request: Request, response: Response) {
    try {
      const { id, status } = request.body;
      const stts = (status: string) => {
        switch (status) {
          case 'pending':
            return 0;
          case 'inProgress':
            return 1;
          case 'awaitingDelivery':
            return 2;
          case 'finished':
            return 3;
          case 'canceled':
            return 4;
          default:
            return -1; // Retorne um valor padrão caso o status não seja reconhecido
        }
      };
      const query = `
      UPDATE public.volunteer SET status = ${stts(status)}
      WHERE volunteer.id = ${id};
    `;

      // Execute a query e obtenha o ID retornado
      const result = await manager.query(query);
      return [];
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação'
      });
    } finally {
      // await this.connection.closePortalpod();
    }
  }

  async getHistoryDonorVolunteer(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { id, donor_id } = request.body;

      let userQuery = manager
        .createQueryBuilder()
        .select([
          'volunteer_subscribe.id',
          'volunteer_subscribe.phone',
          `COALESCE(users.username,'Anônimo') as username`
        ])
        .from('volunteer_subscribe', 'volunteer_subscribe')
        .leftJoin('users', 'users', 'volunteer_subscribe.donor_id = users.id');

      if (donor_id) {
        userQuery = userQuery.andWhere(`volunteer_subscribe.donor_id = '${parseInt(donor_id)}'`);
      }
      if (id) {
        userQuery = userQuery.andWhere(`volunteer_subscribe.volunteer_id = '${parseInt(id)}'`);
      }

      const volunteer = await userQuery.getRawMany();
      if (volunteer) {
        return volunteer;
      }
      return [];
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação'
      });
    } finally {
      // await this.connection.closePortalpod();
    }
  }

  async ScheduleOrder(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { id, scheduleDate } = request.body;

      // Verificar se o usuário existe
      const query = `
      UPDATE public.volunteer SET scheduling = TO_TIMESTAMP('${scheduleDate}', 'YYYY-MM-DD HH24:MI:SS')
      WHERE volunteer.id = ${id};`;

      const schedule = await manager.query(query);
      // Retornar o token como resposta
      if (schedule) {
        return schedule;
      }
      return [];
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação'
      });
    } finally {
      // await this.connection.closePortalpod();
    }
  }
  async Subscribe(request: Request, response: Response) {
    try {
      const { volunteer_id, phone, donor_id } = request.body;

      let donorId = '';
      let donorValue = '';
      if (donor_id) {
        donorId = ` , donor_id`;
        donorValue = ` ,  ${parseInt(donor_id)}`;
      }

      const query = `
      INSERT INTO public.volunteer_subscribe (volunteer_id, phone ${donorId})
      VALUES (${volunteer_id},${phone} ${donorValue})`;
      await manager.query(query);

      return [];
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação'
      });
    } finally {
      // await this.connection.closePortalpod();
    }
  }

  async Unsubscribe(request: Request, response: Response) {
    try {
      const { volunteer_id, donor_id } = request.body;

      if (!donor_id || !volunteer_id) {
        return response.status(400).send({
          error: 'O campo donor_id é obrigatório'
        });
      }

      const query = `
        DELETE FROM public.volunteer_subscribe
        WHERE donor_id = ${parseInt(donor_id)}
        AND volunteer_id = ${volunteer_id};
      `;
      await manager.query(query);

      return [];
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação'
      });
    } finally {
      // await this.connection.closePortalpod();
    }
  }

  async deleteVolunteer(request: Request, response: Response) {
    try {
      const { id } = request.body;

      // Verificar se o usuário existe
      const userQuery = manager
        .createQueryBuilder()
        .select('volunteer.*')
        .from('volunteer', 'volunteer')
        .where(`volunteer.id = '${parseInt(id)}'`);

      const user = await userQuery.getRawOne();
      // Retornar o token como resposta
      if (user) {
        const delet = await manager
          .createQueryBuilder()
          .delete()
          .from('volunteer')
          .where('id = :id', { id: id })
          .execute();
      } else {
        return response.status(500).send({
          error: 'Houve um erro na aplicação'
        });
      }
      return [];
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação'
      });
    } finally {
      // await this.connection.closePortalpod();
    }
  }
}
