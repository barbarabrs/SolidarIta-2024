import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { connect } from '../../database/index';
import Controller from '../Controller';
import crypto from 'crypto';

connect();
const manager = getManager();
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string
  }
});

export default class UsersController extends Controller {
  async getUsers(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { id } = request.body;

      // Verificar se o usuário existe
      const userQuery = manager
        .createQueryBuilder()
        .select('users.*, user_types.roles, user_types.name_type')
        .from('users', 'users')
        .innerJoin('user_types', 'user_types', 'users.user_types = user_types.id')
        .where(`users.id = '${parseInt(id)}'`)
        .andWhere(`users.activated = 1`);

      const user = await userQuery.getRawOne();
      // Retornar o token como resposta
      if (user) {
        return user;
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

  async getUsersList(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { user_type, pending, canceled } = request.body;

      // Verificar se o usuário existe
      let userQuery = manager.createQueryBuilder().select('users.*').from('users', 'users').where(`1 = 1`);

      if (user_type) {
        userQuery = userQuery.andWhere(`users.user_types = '${parseInt(user_type)}'`);
      }

      if (pending) {
        userQuery = userQuery.andWhere(`users.activated = 0`);
      } else if (canceled) {
        userQuery = userQuery.andWhere(`users.activated = 2`);
      } else {
        userQuery = userQuery.andWhere(`users.activated = 1`);
      }
      const users = await userQuery.getRawMany();
      // Retornar o token como resposta
      if (users) {
        return users;
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

  async createUser(request: Request, response: Response) {
    try {
      interface Match {
        email?: string;
        cnpj_legal?: string;
        social_reason?: string;
        phone?: string;
      }
      // Obter email e senha do corpo da solicitação
      const body = request.body;

      let conditions = '';
      if (body.email) {
        conditions += `users.email = '${body.email}' OR `;
      }
      if (body.cnpj_legal) {
        conditions += `users.cnpj_legal = '${body.cnpj_legal}' OR `;
      }
      if (body.social_reason) {
        conditions += `users.social_reason = '${body.social_reason}' OR `;
      }
      if (body.phone) {
        conditions += `users.phone = '${body.phone}' OR `;
      }
      if (body.pix) {
        conditions += `users.pix = '${body.pix}' OR `;
      }

      // Remove o último " OR " se houver condições adicionadas
      if (conditions.endsWith(' OR ')) {
        conditions = conditions.slice(0, -4);
      }

      body.password = crypto
        .createHash('sha256')
        .update(body.password + body.email)
        .digest('hex');

      // Verificar se o usuário existe
      const userQuery = manager
        .createQueryBuilder()
        .select('users.*, user_types.roles, user_types.name_type')
        .from('users', 'users')
        .innerJoin('user_types', 'user_types', 'users.user_types = user_types.id')
        .where(conditions);

      const users = await userQuery.getRawMany();

      for (const user of users) {
        if (user.activated === 0 && user.email === body.email) {
          return response.status(401).json({ message: `Conta já está em processo de validação` });
        }

        if (user.email === body.email) {
          return response.status(401).json({ message: `Email ${body.email} já cadastrado` });
        }
        if (user.cnpj_legal === body.cnpj_legal) {
          return response.status(401).json({ message: `CNPJ ${body.cnpj_legal} já cadastrado` });
        }
        if (user.social_reason === body.social_reason) {
          return response.status(401).json({ message: `Razão Social ${body.social_reason} já cadastrado` });
        }
        if (user.phone === body.phone) {
          return response.status(401).json({ message: `Telefone ${body.phone} já cadastrado` });
        }
        if (user.pix === body.pix) {
          return response.status(401).json({ message: `Telefone ${body.phone} já cadastrado` });
        }
      }

      if (body.user_types === 1) {
        const insert = await manager
          .createQueryBuilder()
          .insert()
          .into('users')
          .values({
            ...body,
            activated: 1
          })
          .execute();

        // Retornar o token como resposta
        if (users) {
          return response.json({ users });
        }
      } else {
        const insert = await manager
          .createQueryBuilder()
          .insert()
          .into('users')
          .values({
            ...body,
            activated: 0
          })
          .execute();

        // Retornar o token como resposta
        if (users) {
          return response.json({ users });
        }
      }

      return response.json({});
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação'
      });
    } finally {
      // await this.connection.closePortalpod();
    }
  }

  async editUser(request: Request, response: Response) {
    const body = request.body.data;
    const { id, ...newBody } = body;

    let imageUrl;
    if (newBody.password) {
      newBody.password = crypto
        .createHash('sha256')
        .update(body.password + body.email)
        .digest('hex');
    }
    if (newBody.image) {
      const [_match, contentType, imageExtension] = newBody.image.match(
        /^data:([a-zA-Z0-9]+\/([a-zA-Z0-9-.+]+)).*,.*/i
      ) || ['', 'jpeg'];
      const base64Data = newBody.image.replace(/^data:image\/\w+;base64,/, '');
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
    try {
      const update = await manager
        .createQueryBuilder()
        .update('users')
        .set({
          ...newBody,
          ...(imageUrl ? { image: imageUrl } : {})
        })
        .where('id = :id', { id: id })
        .execute();

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

  async verify(request: Request, response: Response) {
    const { id, ...newBody } = request.body;

    try {
      const update = await manager
        .createQueryBuilder()
        .update('users')
        .set({
          ...newBody
        })
        .where('id = :id', { id: id })
        .execute();

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

  async checkPassword(request: Request, response: Response) {
    const { id, password, email } = request.body;

    try {
      const userQuery = manager
        .createQueryBuilder()
        .select('users.password')
        .from('users', 'users')
        .where(`users.id = ${id}`);

      const passw = await userQuery.getRawOne();
      const passw2 = crypto
        .createHash('sha256')
        .update(password + email)
        .digest('hex');
      if (passw.password !== passw2) {
        return { status: false };
      } else {
        return { status: true };
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

  async deleteUser(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { id } = request.body;

      // Verificar se o usuário existe
      const userQuery = manager
        .createQueryBuilder()
        .select('users.*')
        .from('users', 'users')
        .where(`users.id = '${parseInt(id)}'`);

      const user = await userQuery.getRawOne();
      // Retornar o token como resposta
      if (user) {
        const update = await manager
          .createQueryBuilder()
          .update('users')
          .set({
            activated: 2
          })
          .where('id = :id', { id: id })
          .execute();

        if (user['user_types'] === 2) {
          const result = await manager
            .createQueryBuilder()
            .delete()
            .from('grocery_list')
            .where('owner_id = :id', { id: id })
            .execute();
        } else if (user['user_types'] === 3) {
          const result = await manager
            .createQueryBuilder()
            .delete()
            .from('grocery_list')
            .where('partner_id = :id', { id: id })
            .execute();
          const result2 = await manager
            .createQueryBuilder()
            .delete()
            .from('products')
            .where('owner_user_id = :id', { id: id })
            .execute();
        }
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
