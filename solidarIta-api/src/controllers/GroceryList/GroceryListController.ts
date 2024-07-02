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

export default class GroceryListController extends Controller {
  async getGroceryLists(request: Request, response: Response) {
    try {
      const { id, from, status } = request.body;

      let where = '';
      let username = '';
      if (from === 'partner') {
        username = 'owner_id';
        where = 'partner_id';
      } else {
        username = 'partner_id';
        where = 'owner_id';
      }
      // Verificar se o usuário existe
      let userQuery = manager
        .createQueryBuilder()
        .select([
          'grocery_list.name as name',
          'grocery_list.description',
          'grocery_list.goal',
          'grocery_list.image',
          'grocery_list.accountability',
          'status_campain.description as status',
          'grocery_list.id',
          'users.username'
        ])
        .from('grocery_list', 'grocery_list')
        .innerJoin('users', 'users', `grocery_list.${username} = users.id`)
        .innerJoin('status_campain', 'status_campain', `grocery_list.status = status_campain.status`)
        .where(`grocery_list.${where} = ${parseInt(id)}`);
      if (status !== undefined) {
        userQuery = userQuery.andWhere(`grocery_list.status = '${parseInt(status)}'`);
      }

      const groceryList = await userQuery.getRawMany();
      // Retornar o token como resposta
      if (groceryList) {
        return groceryList;
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

  async getOneGroceryList(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { id, donor_id, owner, partner, user_id, user_type } = request.body;

      // Verificar se o usuário existe
      let query = manager
        .createQueryBuilder()
        .select([
          'grocery_list.name as name',
          'grocery_list.description',
          'grocery_list.goal',
          'grocery_list.image',
          'grocery_list.scheduling',
          'grocery_list.owner_id',
          'grocery_list.accountability',
          'status_campain.description as status',
          'owner.username',
          'grocery_list.partner_id',
          'partner.pix',
          'partner.username as partner',
          'accountability.message as accountability_message'
        ])
        .from('grocery_list', 'grocery_list')
        .innerJoin('users', 'owner', 'grocery_list.owner_id = owner.id')
        .leftJoin(
          'grocery_list_products',
          'grocery_list_products',
          'grocery_list.id = grocery_list_products.grocery_list_id'
        )
        .innerJoin('users', 'partner', 'grocery_list.partner_id = partner.id')
        .innerJoin('status_campain', 'status_campain', `grocery_list.status = status_campain.status`)
        .leftJoin('accountability', 'accountability', `grocery_list.id = accountability.grocery_list_id`)
        .where(`grocery_list.id = ${parseInt(id)}`);

      if (user_id) {
        if (user_type === 2) {
          query = query.andWhere(`grocery_list.owner_id != ${parseInt(user_id)}`);
        } else if (user_type === 3) {
          query = query.andWhere(`grocery_list.partner_id != ${parseInt(user_id)}`);
        }
      }

      if (donor_id) {
        query = query
          .andWhere(`grocery_list.status IN ('1','2','3')`)
          .andWhere(`grocery_list_products.donor_id  = '${parseInt(donor_id)}'`);
      }

      if (owner) {
        query = query.andWhere(`owner.id = ${parseInt(owner)}`);
      }

      if (partner) {
        query = query.andWhere(`partner.id = ${parseInt(partner)}`);
      }

      const groceryList = await query.getRawMany();
      // Retornar o token como resposta
      if (groceryList) {
        return groceryList;
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

  async AddGroceryList(request: Request, response: Response) {
    try {
      interface grocery {
        name: string;
        image: string;
        description: string;
        products: { [key: number]: number }; // referente a tabela grocery_list_products
        partner_id: number;
        goal: string;
        owner_id: number;
      }

      const list: grocery = request.body.data[0];
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
        INSERT INTO grocery_list (name, description, image, partner_id, goal, owner_id, status, date, scheduling)
        VALUES ('${list.name}', '${list.description}', '${imageUrl}', ${list.partner_id}, '${list.goal}', ${list.owner_id}, 0, '${date}', null)
        RETURNING id; 
    `;

      // Execute a query e obtenha o ID retornado
      const result = await manager.query(query);
      const grocery_list_id = result[0].id;

      for (const productId in list.products) {
        const amount = list.products[productId];
        const query2 = `
            INSERT INTO grocery_list_products (product_id, grocery_list_id, amount)
            VALUES (${productId}, ${grocery_list_id}, ${amount});
        `;
        // Execute a query2 aqui
        const result2 = await manager.query(query2);
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
  async EditGroceryList(request: Request, response: Response) {
    try {
      interface grocery {
        name: string;
        image: string;
        description: string;
        products: { [key: number]: number }; // referente a tabela grocery_list_products
        partner_id: number;
        goal: string;
        owner_id: number;
        id: string;
      }

      const list: grocery = request.body.data;
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
      UPDATE grocery_list
      SET name = '${list.name}',
          description = '${list.description}',
          goal = '${list.goal}',
          date = '${date}'
          ${imageUrlUpdate}
      WHERE id = ${parseInt(list.id)}
    `;

      await manager.query(query);

      const deleteQuery = `
        DELETE FROM grocery_list_products
        WHERE grocery_list_id = ${list.id} AND COALESCE(paid, 0) != 1;
      `;

      await manager.query(deleteQuery);
      for (const productId in list.products) {
        const amount = list.products[productId];
        if (amount > 0) {
          const query2 = `
          INSERT INTO grocery_list_products (product_id, grocery_list_id, amount)
          VALUES (${productId}, ${list.id}, ${amount});
      `;

          // Execute a query2 aqui
          const result2 = await manager.query(query2);
        }
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
      UPDATE public.grocery_list SET status = ${stts(status)}
      WHERE grocery_list.id = ${id};
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

  async getHistoryDonorGroceryList(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { id, donor_id } = request.body;

      let userQuery = manager
        .createQueryBuilder()
        .select([
          'grocery_list_products.amount',
          'products.name as name',
          'products.price as price',
          `COALESCE(users.username,'Anônimo') as username`,
          'grocery_list_products.grocery_list_id as grocerylist'
        ])
        .from('grocery_list_products', 'grocery_list_products')
        .innerJoin('products', 'products', 'grocery_list_products.product_id = products.id')
        .leftJoin('users', 'users', 'grocery_list_products.donor_id = users.id');

      if (donor_id) {
        userQuery = userQuery.andWhere(`grocery_list_products.donor_id = '${parseInt(donor_id)}'`);
      }
      if (id) {
        userQuery = userQuery.andWhere(`grocery_list_products.grocery_list_id = '${parseInt(id)}'`);
      }

      const groceryList = await userQuery.getRawMany();
      if (groceryList) {
        return groceryList;
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
      UPDATE public.grocery_list SET scheduling = TO_TIMESTAMP('${scheduleDate}', 'YYYY-MM-DD HH24:MI:SS')
      WHERE grocery_list.id = ${id};`;

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
      const { grocery_list_id, products_ids, donor_id } = request.body;

      let donorId = '';
      if (donor_id) {
        donorId = ` , donor_id = ${parseInt(donor_id)}`;
      }
      products_ids.forEach(async (id: string) => {
        const query = `
        UPDATE public.grocery_list_products SET paid = 1 ${donorId}
        WHERE grocery_list_products.product_id = ${parseInt(
          id
        )}  AND grocery_list_products.grocery_list_id = ${parseInt(grocery_list_id)}`;
        await manager.query(query);
      });

      const productsIdsNumber: number[] = products_ids.map(Number);

      const query2 = manager
        .createQueryBuilder()
        .select(['grocery_list_products.id'])
        .from('grocery_list_products', 'grocery_list_products')
        .where(
          `COALESCE(grocery_list_products.paid, 0) != 1 AND grocery_list_products.product_id NOT IN (${productsIdsNumber.join(
            ','
          )}) AND grocery_list_products.grocery_list_id = ${parseInt(grocery_list_id)}`
        );

      const groceryList = await query2.getRawMany();

      if (groceryList.length === 0) {
        request.body = { id: grocery_list_id, status: 'awaitingDelivery' };
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

  async deleteGroceryList(request: Request, response: Response) {
    try {
      const { id } = request.body;

      // Verificar se o usuário existe
      const userQuery = manager
        .createQueryBuilder()
        .select('grocery_list.*')
        .from('grocery_list', 'grocery_list')
        .where(`grocery_list.id = '${parseInt(id)}'`);

      const user = await userQuery.getRawOne();
      // Retornar o token como resposta
      if (user) {
        const delet = await manager
          .createQueryBuilder()
          .delete()
          .from('grocery_list')
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
