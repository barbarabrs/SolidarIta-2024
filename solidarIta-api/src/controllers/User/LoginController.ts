import crypto from 'crypto';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { connect } from '../../database/index';
import Controller from '../Controller';

connect();
const manager = getManager();

export default class LoginController extends Controller {
  async auth(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { email, password } = request.body;
      const passwordCry = crypto
        .createHash('sha256')
        .update(password + email)
        .digest('hex');

      // Verificar se o usuário existe
      const userQuery = manager
        .createQueryBuilder()
        .select('users.*, user_types.roles, user_types.name_type')
        .from('users', 'users')
        .innerJoin('user_types', 'user_types', 'users.user_types = user_types.id')
        .where(`email = '${email}'`);

      const user = await userQuery.getRawOne();
      if (!user) {
        return response
          .status(401)
          .json({ message: 'Nome de usuário ou senha incorretas. Verifique as suas credenciais e tente novamente' });
      }

      // Comparar as senhas
      if (passwordCry !== user.password) {
        return response
          .status(401)
          .json({ message: 'Nome de usuário ou senha incorretas. Verifique as suas credenciais e tente novamente' });
      }

      // Verifica se a conta está ativada
      if (user.activated === 0) {
        return response.status(401).json({
          message:
            'Desculpe, sua conta ainda está em processo de validação. Por favor, aguarde a confirmação por e-mail para acessar sua conta.'
        });
      } else if (user.activated === 2) {
        return response.status(401).json({
          message:
            'Sua conta está bloqueada. Se você acredita que isso foi feito indevidamente, entre em contato com um dos administradores para mais informações.'
        });
      }

      // Gerar token JWT
      const token = jwt.sign({ userId: user.id }, 'secret', {
        expiresIn: '1h'
      });

      // Retornar o token como resposta
      return response.json({ token, user });
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
