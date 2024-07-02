import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { connect } from '../../database/index';
import Controller from '../Controller';

connect();
const manager = getManager();

export default class AccountabilityController extends Controller {
  async accountability(request: Request, response: Response) {
    const { grocery_list_id } = request.body;
    try {
      // Verificar se o usuário existe
      const userQuery = manager
        .createQueryBuilder()
        .select('accountability.*')
        .from('accountability', 'accountability')
        .where(`accountability = ${parseInt(grocery_list_id)}`);

      const Accountability = await userQuery.getRawMany();
      // Retornar o token como resposta
      if (Accountability) {
        return Accountability;
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

  async addAccountability(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { grocery_list_id, message, donation_id, volunteer_id } = request.body;

      const campaign = grocery_list_id ? grocery_list_id : donation_id ? donation_id : volunteer_id ? volunteer_id : '';
      const table = grocery_list_id ? 'grocery_list' : donation_id ? 'donation' : volunteer_id ? 'volunteer' : '';
      const query = `
      UPDATE ${table}
      SET accountability = 1
      WHERE id = ${parseInt(campaign)}
    `;
      // Execute a query2 aqui
      const exec = await manager.query(query);

      const query2 = `
      INSERT INTO accountability (grocery_list_id, donation_id, volunteer_id, message)
      VALUES (${table === 'grocery_list' ? parseInt(campaign) : 'NULL'},
              ${table === 'donation' ? parseInt(campaign) : 'NULL'},
              ${table === 'volunteer' ? parseInt(campaign) : 'NULL'},
              '${message}');
  `;
      // Execute a query2 aqui
      const Accountability = await manager.query(query2);
      // Retornar o token como resposta
      if (Accountability) {
        return Accountability;
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
