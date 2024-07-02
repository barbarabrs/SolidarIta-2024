import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { connect } from '../../database/index';
import Controller from '../Controller';

connect();
const manager = getManager();

export default class CampaignsController extends Controller {
  async getActiveCampaigns(request: Request, response: Response) {
    try {
      const { user_type, id, activated, user_id, type } = request.body;
      // Verificar se o usuário existe
      const groceryListQuery = manager
        .createQueryBuilder()
        .select([
          `'groceryList' as type`,
          'status_campain.description as status',
          'grocery_list.name as name',
          'grocery_list.description as description',
          'grocery_list.image as image',
          'grocery_list.date as date',
          'owner_grocery_list.username as owner',
          'owner_grocery_list.image as owner_image',
          'partner.username as partner',
          'partner.image as partner_image',
          'grocery_list.id AS id'
        ])
        .from('status_campain', 'status_campain')
        .leftJoin('grocery_list', 'grocery_list', 'status_campain.status = grocery_list.status')
        .leftJoin('users', 'owner_grocery_list', 'grocery_list.owner_id = owner_grocery_list.id')
        .leftJoin('users', 'partner', 'grocery_list.partner_id = partner.id')
        .where('name IS NOT NULL');

      const donationQuery = manager
        .createQueryBuilder()
        .select([
          `'donate' as type`,
          'status_campain.description as status',
          'donation.name as name',
          'donation.description as description',
          'donation.image as image',
          'donation.date as date',
          'owner_donation.username as owner',
          'owner_donation.image as owner_image',
          'null as partner',
          'null as partner_image',
          'donation.id AS id'
        ])
        .from('status_campain', 'status_campain')
        .leftJoin('donation', 'donation', 'status_campain.status = donation.status')
        .leftJoin('users', 'owner_donation', 'donation.owner_id = owner_donation.id')
        .where('name IS NOT NULL');

      const volunteerQuery = manager
        .createQueryBuilder()
        .select([
          `'volunteering' as type`,
          'status_campain.description as status',
          'volunteer.name as name',
          'volunteer.description as description',
          'volunteer.image as image',
          'volunteer.date as date',
          'owner_volunteer.username as owner',
          'owner_volunteer.image as owner_image',
          'null as partner',
          'null as partner_image',
          'volunteer.id AS id'
        ])
        .from('status_campain', 'status_campain')
        .leftJoin('volunteer', 'volunteer', 'status_campain.status = volunteer.status')
        .leftJoin('users', 'owner_volunteer', 'volunteer.owner_id = owner_volunteer.id')
        .where('name IS NOT NULL');

      if (activated) {
        donationQuery.andWhere(`status_campain.status = 1`);
        groceryListQuery.andWhere(`status_campain.status = 1`);
        volunteerQuery.andWhere(`status_campain.status = 1`);
      } else {
        donationQuery.andWhere(`status_campain.status IN (1,2,3)`);
        groceryListQuery.andWhere(`status_campain.status IN (1,2,3)`);
        volunteerQuery.andWhere(`status_campain.status IN (1,2,3)`);
      }
      if (type) {
        if (type === 2) {
          donationQuery.andWhere(`owner_donation.id = ${parseInt(id)}`);
          volunteerQuery.andWhere(`owner_volunteer.id = ${parseInt(id)}`);
          groceryListQuery.andWhere(`owner_grocery_list.id = ${parseInt(id)}`);
        } else if (type === 3) {
          donationQuery.andWhere(`1 = 0`);
          volunteerQuery.andWhere(`1 = 0`);
          groceryListQuery.andWhere(`partner.id = ${parseInt(id)}`);
        }
      }

      if (user_id) {
        if (user_type === 2) {
          donationQuery.andWhere(`owner_donation.id != ${parseInt(user_id)}`);
          volunteerQuery.andWhere(`owner_volunteer.id != ${parseInt(user_id)}`);
          groceryListQuery.andWhere(`owner_grocery_list.id != ${parseInt(user_id)}`);
        } else if (user_type === 3) {
          groceryListQuery.andWhere(`partner.id != ${parseInt(user_id)}`);
        }
      } else {
        donationQuery.andWhere(`owner_donation.id != 0`);
        volunteerQuery.andWhere(`owner_volunteer.id != 0`);
        groceryListQuery.andWhere(`owner_grocery_list.id != 0`);
      }

      const campaigns = [];
      const groceryListResult = await groceryListQuery.getRawMany();
      const donationResult = await donationQuery.getRawMany();
      const volunteerResult = await volunteerQuery.getRawMany();

      if (groceryListResult.length > 0) {
        campaigns.push(...groceryListResult);
      }

      if (donationResult.length > 0) {
        campaigns.push(...donationResult);
      }

      if (volunteerResult.length > 0) {
        campaigns.push(...volunteerResult);
      }

      // Ordena os resultados por data mais recente e, em seguida, por nome
      campaigns.sort((a, b) => {
        // Ordena por data mais recente
        const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateComparison !== 0) {
          return dateComparison;
        }

        // Se as datas forem iguais, ordena por nome em ordem alfabética
        return a.name.localeCompare(b.name);
      });

      // Retornar o token como resposta
      if (campaigns) {
        return campaigns;
      }
      return [];
    } catch (error) {
      console.error(error);
      return Promise.reject('Erro interno');
    } finally {
      // await this.connection.closePortalpod();
    }
  }

  async getCampainsHistory(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { donor_id } = request.body;

      const groceryListQuery = manager
        .createQueryBuilder()
        .select([
          'status_campain.status',
          `'groceryList' as type`,
          'grocery_list.id as id',
          `MAX(grocery_list.date) as date`,
          `MAX(grocery_list.image) as image`,
          `MAX(grocery_list.name) as name`,
          `MAX(grocery_list.description) as description`,
          `MAX(owner.username) as owner`,
          `MAX(owner.image) as owner_image`,
          `MAX(partner.username) as partner`,
          `MAX(partner.image) as partner_image`
        ])
        .from('status_campain', 'status_campain')
        .innerJoin('grocery_list', 'grocery_list', 'status_campain.status = grocery_list.status')
        .innerJoin(
          'grocery_list_products',
          'grocery_list_products',
          'grocery_list_products.grocery_list_id = grocery_list.id'
        )
        .innerJoin('users', 'owner', 'grocery_list.owner_id = owner.id')
        .innerJoin('users', 'partner', 'grocery_list.partner_id = partner.id')
        .where(`status_campain.status IN ('1','2','3')`)
        .andWhere(`grocery_list_products.donor_id  = '${parseInt(donor_id)}'`)
        .groupBy(`grocery_list.id`)
        .addGroupBy(`status_campain.status`);

      const donationQuery = manager
        .createQueryBuilder()
        .select([
          'status_campain.status',
          `'donate' as type`,
          'donation.id as id',
          `MAX(donation.date) as date`,
          `MAX(donation.image) as image`,
          `MAX(donation.name) as name`,
          `MAX(donation.description) as description`,
          `MAX(owner.username) as owner`,
          `MAX(owner.image) as owner_image`,
          'null as partner',
          'null as partner_image'
        ])
        .from('status_campain', 'status_campain')
        .innerJoin('donation', 'donation', 'status_campain.status = donation.status')
        .innerJoin('donation_amount', 'donation_amount', 'donation_amount.donation_id = donation.id')
        .innerJoin('users', 'owner', 'donation.owner_id = owner.id')
        .where(`status_campain.status IN ('1','2','3')`)
        .andWhere(`donation_amount.donor_id  = '${parseInt(donor_id)}'`)
        .groupBy(`donation.id`)
        .addGroupBy(`status_campain.status`);

      const volunteerQuery = manager
        .createQueryBuilder()
        .select([
          'status_campain.status',
          `'volunteering' as type`,
          'volunteer.id as id',
          'status_campain.status',
          `MAX(volunteer.date) as date`,
          `MAX(volunteer.image) as image`,
          `MAX(volunteer.name) as name`,
          `MAX(volunteer.description) as description`,
          `MAX(volunteer.goal) as goal`,
          `MAX(owner.username) as owner`,
          `MAX(owner.image) as owner_image`,
          'null as partner',
          'null as partner_image'
        ])
        .from('status_campain', 'status_campain')
        .innerJoin('volunteer', 'volunteer', 'status_campain.status = volunteer.status')
        .innerJoin('volunteer_subscribe', 'volunteer_subscribe', 'volunteer_subscribe.volunteer_id = volunteer.id')
        .innerJoin('users', 'owner', 'volunteer.owner_id = owner.id')
        .where(`status_campain.status IN ('1','2','3')`)
        .andWhere(`volunteer_subscribe.donor_id  = '${parseInt(donor_id)}'`)
        .groupBy(`volunteer.id`)
        .addGroupBy(`status_campain.status`);

      const campaigns = [];

      const groceryListResult = await groceryListQuery.getRawMany();
      const donationResult = await donationQuery.getRawMany();
      const volunteerResult = await volunteerQuery.getRawMany();

      if (groceryListResult.length > 0) {
        campaigns.push(...groceryListResult);
      }

      if (donationResult.length > 0) {
        campaigns.push(...donationResult);
      }

      if (volunteerResult.length > 0) {
        campaigns.push(...volunteerResult);
      }

      // Ordena os resultados por data mais recente e, em seguida, por nome
      campaigns.sort((a, b) => {
        // Ordena por data mais recente
        const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateComparison !== 0) {
          return dateComparison;
        }

        // Se as datas forem iguais, ordena por nome em ordem alfabética
        return a.name.localeCompare(b.name);
      });

      // Retornar o token como resposta
      if (campaigns) {
        return campaigns;
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

  async getCampainsFinished(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const groceryListQuery = manager
        .createQueryBuilder()
        .select([
          `'groceryList' as type`,
          'status_campain.status',
          'grocery_list.id as id',
          `MAX(grocery_list.image) as image`,
          `MAX(grocery_list.name) as name`,
          `MAX(grocery_list.description) as description`,
          `COALESCE(MAX(grocery_list.date), to_date('1900-01-01', 'YYYY-MM-DD')) as date`,
          `MAX(grocery_list.accountability) as accountability`,
          `MAX(owner.username) as owner`,
          `MAX(owner.image) as owner_image`,
          `MAX(partner.username) as partner`,
          `MAX(partner.image) as partner_image`
        ])
        .from('status_campain', 'status_campain')
        .innerJoin('grocery_list', 'grocery_list', 'status_campain.status = grocery_list.status')
        .innerJoin(
          'grocery_list_products',
          'grocery_list_products',
          'grocery_list_products.grocery_list_id = grocery_list.id'
        )
        .innerJoin('users', 'owner', 'grocery_list.owner_id = owner.id')
        .innerJoin('users', 'partner', 'grocery_list.partner_id = partner.id')
        .where(`status_campain.status IN ('3')`)
        .groupBy(`grocery_list.id`)
        .addGroupBy(`status_campain.status`);

      const donationQuery = manager
        .createQueryBuilder()
        .select([
          `'donate' as type`,
          'status_campain.status',
          'donation.id as id',
          `MAX(donation.image) as image`,
          `MAX(donation.name) as name`,
          `MAX(donation.description) as description`,
          `COALESCE(MAX(donation.date), to_date('1900-01-01', 'YYYY-MM-DD')) as date`,
          'MAX(donation.accountability) as accountability',
          `MAX(owner_donation.username) as owner`,
          `MAX(owner_donation.image) as owner_image`,
          'null as partner',
          'null as partner_image'
        ])
        .from('status_campain', 'status_campain')
        .innerJoin('donation', 'donation', 'status_campain.status = donation.status')
        .innerJoin('users', 'owner_donation', 'donation.owner_id = owner_donation.id')
        .where(`status_campain.status IN ('3')`)
        .groupBy(`donation.id`)
        .addGroupBy(`status_campain.status`);

      const volunteerQuery = manager
        .createQueryBuilder()
        .select([
          `'volunteering' as type`,
          'status_campain.status',
          'volunteer.id as id',
          'volunteer.id as volunteer',
          `MAX(volunteer.image) as image`,
          `MAX(volunteer.name) as name`,
          `MAX(volunteer.description) as description`,
          `COALESCE(MAX(volunteer.date), to_date('1900-01-01', 'YYYY-MM-DD')) as date`,
          'MAX(volunteer.accountability) as accountability',
          `MAX(owner_volunteer.username) as owner`,
          `MAX(owner_volunteer.image) as owner_image`,
          'null as partner',
          'null as partner_image'
        ])
        .from('status_campain', 'status_campain')
        .innerJoin('volunteer', 'volunteer', 'status_campain.status = volunteer.status')
        .innerJoin('users', 'owner_volunteer', 'volunteer.owner_id = owner_volunteer.id')
        .where(`status_campain.status IN ('3')`)
        .groupBy(`volunteer.id`)
        .addGroupBy(`status_campain.status`);

      const campaigns = [];

      const groceryListResult = await groceryListQuery.getRawMany();
      const donationResult = await donationQuery.getRawMany();
      const volunteerResult = await volunteerQuery.getRawMany();

      if (groceryListResult.length > 0) {
        campaigns.push(...groceryListResult);
      }

      if (donationResult.length > 0) {
        campaigns.push(...donationResult);
      }

      if (volunteerResult.length > 0) {
        campaigns.push(...volunteerResult);
      }

      // Ordena os resultados por data mais recente e, em seguida, por nome
      campaigns.sort((a, b) => {
        // Ordena por data mais recente
        const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateComparison !== 0) {
          return dateComparison;
        }

        // Se as datas forem iguais, ordena por nome em ordem alfabética
        return a.name.localeCompare(b.name);
      });

      // Retornar o token como resposta
      if (campaigns) {
        return campaigns;
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
