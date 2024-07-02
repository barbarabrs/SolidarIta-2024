# Projeto SOLIDARITA

## Dependências

- axios
- express
- jsonwebtoken
- moment-timezone
- mysql2
- pino-http
- typeorm
- uniqid

## Dependências de desenvolvimento

- @types/express
- @types/jest
- @types/jsonwebtoken
- @types/node
- @types/pino-http
- @types/uniqid
- dotenv
- jest
- pino-pretty
- prettier
- ts-jest
- tslint
- tslint-config-prettier
- typescript

## INSTALAÇÃO DO PROJETO LOCALMENTE

#### 1) Faça o fork e clone o projeto em seu bitbucket:

```
    git clone https://github.com/NataliaMattos/solidarita-app.git
```

#### 2) Instale as dependências do projeto:

```
    npm install
```

#### 3) Rode o projeto localmente (a porta 4000 é utilizada):

```
    npm run dev
```

- Nessas últimas duas etapas, é comum alguns erros devido a execução de scripts no powershell, caso aconteça, tente executar em um terminal git bash.

### Variáveis de ambiente de aplicação

As variáveis de ambiente estão configuradas dentro da pasta config e possui 2 estágios<br>
de ambiente:  dev _ prod 

## ROTAS

- #### LOGIN (SOLIDARITA)

| MÉTODO | URL DA ROTA |      PARÂMETROS      |
| ------ | :---------: | :------------------: |
| POST   |   /login    | *username, *password |


```
