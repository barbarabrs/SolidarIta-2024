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

export default class DonationController extends Controller {
  async getDonations(request: Request, response: Response) {
    try {
      const { id, status } = request.body;

      // Verificar se o usuário existe
      let userQuery = manager
        .createQueryBuilder()
        .select([
          'donation.name as name',
          'donation.description',
          'donation.goal',
          'donation.image',
          'donation.accountability',
          'status_campain.description as status',
          'users.pix',
          'donation.id',
          'users.username'
        ])
        .from('donation', 'donation')
        .innerJoin('users', 'users', `donation.owner_id = users.id`)
        .innerJoin('status_campain', 'status_campain', `donation.status = status_campain.status`)
        .where(`donation.owner_id = ${parseInt(id)}`);
      if (status !== undefined) {
        userQuery = userQuery.andWhere(`donation.status = '${parseInt(status)}'`);
      }

      const donation = await userQuery.getRawMany();
      // Retornar o token como resposta
      if (donation) {
        return donation;
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

  async getOneDonation(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { id, donor_id, owner, user_id, user_type } = request.body;

      // Verificar se o usuário existe
      let query = manager
        .createQueryBuilder()
        .select([
          'donation.name as name',
          'donation.description',
          'donation.goal',
          'donation.image',
          'donation.owner_id',
          'donation.raised',
          'donation.accountability',
          'status_campain.description as status',
          'owner.username',
          'owner.pix as pix',
          'accountability.message as accountability_message'
        ])
        .from('donation', 'donation')
        .leftJoin('donation_amount', 'donation_amount', 'donation.id = donation_amount.donation_id')
        .innerJoin('users', 'owner', 'donation.owner_id = owner.id')
        .innerJoin('status_campain', 'status_campain', `donation.status = status_campain.status`)
        .leftJoin('accountability', 'accountability', `donation.id = accountability.donation_id`)
        .where(`donation.id = ${parseInt(id)}`);

      if (user_id) {
        if (user_type === 2) {
          query = query.andWhere(`donation.owner_id != ${parseInt(user_id)}`);
        }
      }

      if (donor_id) {
        query = query
          .andWhere(`donation.status IN ('1','2','3')`)
          .andWhere(`donation_amount.donor_id  = '${parseInt(donor_id)}'`);
      }

      if (owner) {
        query = query.andWhere(`owner.id = ${parseInt(owner)}`);
      }

      const donation = await query.getRawMany();
      // Retornar o token como resposta
      if (donation) {
        return donation;
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

  async AddDonation(request: Request, response: Response) {
    try {
      interface donation {
        name: string;
        image: string;
        description: string;
        goal: string;
        owner_id: number;
      }

      const list: donation = request.body;
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
        INSERT INTO donation (name, description, image, goal, owner_id, status, date)
        VALUES ('${list.name}', '${list.description}', '${imageUrl}', '${list.goal}', ${list.owner_id}, 1, '${date}')
        RETURNING id; 
    `;

      // Execute a query e obtenha o ID retornado
      const result = await manager.query(query);
      const donation_id = result[0].id;

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
  async EditDonation(request: Request, response: Response) {
    try {
      interface donation {
        name: string;
        image: string;
        description: string;
        goal: string;
        id: string;
      }

      const list: donation = request.body;
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
      UPDATE donation
      SET name = '${list.name}',
          description = '${list.description}',
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
      UPDATE public.donation SET status = ${stts(status)}
      WHERE donation.id = ${id};
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

  async getHistoryDonorDonation(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { id, donor_id } = request.body;

      let userQuery = manager
        .createQueryBuilder()
        .select([
          'donation_amount.amount as amount',
          `COALESCE(users.username,'Anônimo') as username`,
          'donation_amount.donation_id as id'
        ])
        .from('donation_amount', 'donation_amount')
        .leftJoin('users', 'users', 'donation_amount.donor_id = users.id');

      if (donor_id) {
        userQuery = userQuery.andWhere(`donation_amount.donor_id = '${parseInt(donor_id)}'`);
      }
      if (id) {
        userQuery = userQuery.andWhere(`donation_amount.donation_id = '${parseInt(id)}'`);
      }

      const donation = await userQuery.getRawMany();
      if (donation) {
        return donation;
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
      UPDATE public.donation SET scheduling = TO_TIMESTAMP('${scheduleDate}', 'YYYY-MM-DD HH24:MI:SS')
      WHERE donation.id = ${id};`;

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
  async Payment(request: Request, response: Response) {
    try {
      const { donation_id, amount, donor_id } = request.body;

      let donorId = '';
      let donorValue = '';
      if (donor_id) {
        donorId = ` , donor_id`;
        donorValue = ` ,  ${parseInt(donor_id)}`;
      }

      const query = `
      INSERT INTO public.donation_amount (donation_id, amount ${donorId})
      VALUES (${donation_id},${amount} ${donorValue})`;
      await manager.query(query);

      const query2 = manager
        .createQueryBuilder()
        .from('donation', 'donation')
        .where(`donation.id = ${parseInt(donation_id)}`);
      const donation = await query2.getRawMany();

      let raised = 0;
      if (donation.length !== 0) {
        raised = parseFloat(donation[0]['raised'] || 0) + parseFloat(amount);
        if (raised > parseFloat(donation[0]['goal'])) {
          raised = parseFloat(donation[0]['goal']);
        }
      }

      const query3 = `
        UPDATE public.donation SET raised = ${raised}
        WHERE donation.id = ${parseInt(donation_id)}`;
      await manager.query(query3);

      if (donation.length !== 0 && raised === parseFloat(donation[0]['goal'])) {
        request.body = { id: donation_id, status: 'finished' };
        this.ChangeStatus(request, response);
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

  async deleteDonation(request: Request, response: Response) {
    try {
      const { id } = request.body;

      // Verificar se o usuário existe
      const userQuery = manager
        .createQueryBuilder()
        .select('donation.*')
        .from('donation', 'donation')
        .where(`donation.id = '${parseInt(id)}'`);

      const user = await userQuery.getRawOne();
      // Retornar o token como resposta
      if (user) {
        const delet = await manager
          .createQueryBuilder()
          .delete()
          .from('donation')
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
