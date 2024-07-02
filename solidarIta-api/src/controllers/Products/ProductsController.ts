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

export default class ProductsController extends Controller {
  async getProducts(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { id } = request.body;

      // Verificar se o usuário existe
      const userQuery = manager
        .createQueryBuilder()
        .select('products.*,users.username, users.image as user_image')
        .from('products', 'products')
        .innerJoin('users', 'users', 'products.owner_user_id = users.id')
        .where(`products.owner_user_id = '${parseInt(id)}'`);

      const products = await userQuery.getRawMany();
      // Retornar o token como resposta
      if (products) {
        return products;
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

  async AddProduct(request: Request, response: Response) {
    try {
      interface Item {
        name: string;
        price: string;
        description?: string;
        image?: string;
      }
      const { items, id } = request.body;
      //   const names = items.map((item: Item) => item.name);

      const date = moment().format('YYYY-MM-DD');

      //   let conditions = '';
      //   conditions = `products.name IN '${names}'`;
      //   conditions += `users.id = '${id}'`;

      // Verificar se o produto já existe, se sim atualiza se não cria novo registro
      //   const query = `
      //     INSERT INTO products (owner_user_id, name, price, description, date)
      //     VALUES (${id}, '${items[0].name}', ${items[0].price}, '${items[0].description}', '${date}')
      //     ON CONFLICT (owner_user_id, name) DO UPDATE SET price = ${items[0].price}, description = '${items[0].description}', date = '${date}';
      // `;

      // const productsQuery = await manager.query(query);

      items.forEach(async (item: Item) => {
        try {
          let imageUrl = '';
          let imageUrlUpdate = '';
          if (item.image) {
            const [_match, contentType, imageExtension] = item.image.match(
              /^data:([a-zA-Z0-9]+\/([a-zA-Z0-9-.+]+)).*,.*/i
            ) || ['', 'jpeg'];
            const base64Data = item.image.replace(/^data:image\/\w+;base64,/, '');
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
            INSERT INTO products (owner_user_id, name, price, description, date, image)
            VALUES (${id}, '${item.name}', ${item.price}, '${item.description}', '${date}', '${imageUrl}')
            ON CONFLICT (owner_user_id, name) DO UPDATE SET
            price = ${item.price},
            description = '${item.description}',
            date = '${date}'
            ${imageUrlUpdate}
        `;
          await manager.query(query);
        } catch (error) {
          console.error(error);
          return response.status(500).send({
            error: 'Houve um erro na aplicação'
          });
        }
      });

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

  async deleteProduct(request: Request, response: Response) {
    try {
      const { id } = request.body;

      await manager.query(`DELETE FROM products Where products.id = ${parseInt(id)}`);

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

  async getOneProductsList(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { id, notPaid } = request.body;

      let userQuery = manager
        .createQueryBuilder()
        .select([
          'grocery_list_products.paid',
          'grocery_list_products.amount',
          'products.name as name',
          'products.description as description',
          'products.price as price',
          'products.id as id',
          'products.image as image',
          'users.username'
        ])
        .from('grocery_list_products', 'grocery_list_products')
        .innerJoin('products', 'products', 'grocery_list_products.product_id = products.id')
        .innerJoin('grocery_list', 'grocery_list', 'grocery_list_products.grocery_list_id = grocery_list.id')
        .innerJoin('users', 'users', 'grocery_list.owner_id = users.id')
        .where(`grocery_list_products.grocery_list_id = '${parseInt(id)}'`);

      if (notPaid) {
        userQuery = userQuery.andWhere(`COALESCE(grocery_list_products.paid, 0) != 1`);
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
}
