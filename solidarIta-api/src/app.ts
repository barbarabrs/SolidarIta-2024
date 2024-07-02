'use strict';
import express from 'express';
import { route as createRoutes } from './routers';
import Pino from 'pino';
import PinoHttp from 'pino-http';
import { errors } from 'celebrate';
import cors from 'cors';
import { IncomingMessage, ServerResponse } from 'http';

const pinoConfig = {
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level(label: string) {
      return { level: label };
    }
  },
  timestamp: () => `,"timestamp":"${Date.now()}"`,
  redact: {
    paths: ['req[*].authorization', 'req[*].password', 'req[*].email', 'req[*].phone']
  },
  serializers: {
    req(req: any) {
      req.body = req.raw.body;
      return req;
    }
  },
  customLogLevel: (req: IncomingMessage, res: ServerResponse, err: any) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  autoLogging: {
    ignore(req: IncomingMessage) {
      return req.url === '/';
    }
  }
};

const logger = Pino(pinoConfig);
const expressLogger = PinoHttp(pinoConfig);

const app = express();
app.use(cors());
app.options('*', cors());

const executionTimeout = process.env.EXECUTION_TIMEOUT || '150000';

app.use((request: any, response: any, next: any) => {
  request.headers['content-type'] = 'application/json';
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(expressLogger);

app.set('logger', logger);

// Middleware do autorizador
app.use(async (request: any, response: any, next: any) => {
  try {
    request.setTimeout(parseInt(executionTimeout));
    if (['/login', '/'].includes(request.path)) return next();
    next();
  } catch (error) {
    next(error);
  }
});

createRoutes(app);

app.use(errors());

// Middleware para tratamento de erros
app.use((error: any, request: any, response: any, next: any) => {
  if (error !== undefined) {
    if ('code' in error && typeof error.code !== 'number') {
      error.code = 500;
      error.message = 'Erro interno';
    }

    if (process.env.NODE_ENV !== 'test' && request.dbConnection && request.dbConnection.accountId) {
      error.database = request.dbConnection.accountId;
    }

    response.err = error;
    // Verifica se o header já foi enviado, para não tentar enviar novamente
    if (!response.headersSent)
      response.status(error.code || 500).send({ message: error.message || 'Erro interno', args: error.args || null });
  }

  next();
});

// Middleware de pós execução
// const postExecution = async (request: any, response: any, next: any) => {
//   if ('dbConnection' in request && request.dbConnection instanceof Connection) await request.dbConnection.closeAll();
// };
// app.use(postExecution);
export default app;
