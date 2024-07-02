import { readdirSync } from 'fs';
import { join } from 'path';
// import MethodNotAllowedException from '../response-types/4XX/MethodNotAllowedException';
// import NotFoundException from '../response-types/4XX/NotFoundException';

export function route(app: any) {
  app.all('/', (request: any, response: any, next: any) => {
    response.status(200).send('I am healthy! Thanks for asking! :D');
    next();
  });
  const directoryPath = join(__dirname);

  readdirSync(directoryPath)
    .filter((file) => {
      const fileArr = file.split('.');
      return file.indexOf('.') !== 0 && fileArr[0] !== 'index' && (fileArr[1] === 'ts' || fileArr[1] === 'js');
    })
    .forEach((file) => {
      const { router } = require(`./${file}`);
      router(app);
    });

  app.use((request: any, response: any, next: any) => {
    // Verifica se o header já foi enviado, pois significa que já houve execução do request, e portanto, houve match das rotas da api
    if (response.headersSent) return next();
    // Pega todas as rotas da api
    const routes = app._router.stack.filter((apiRoute: any) => typeof apiRoute.route !== 'undefined');

    const matchedRoutes = routes.filter((apiRoute: any) => typeof apiRoute.path !== 'undefined');

    if (matchedRoutes.length === 0) {
      // Se não teve match, retorna 404
      return '';
      // return next(new NotFoundException(`URL '{0}' não encontrada`, [request.path]));
    } else {
      const methods: string[] = [];
      for (const matchedRoute of matchedRoutes) {
        methods.push(...Object.keys(matchedRoute.route.methods));
      }
      if (
        typeof methods.find((method: string) => method.toLowerCase() === request.method.toLowerCase()) === 'undefined'
      ) {
        // Retorna 405, pois não achou o método
        return next('');
      } else {
        // Achou o método, não retorno erro
        return next();
      }
    }
  });
}
