import {APP_BASE_HREF} from '@angular/common';
import {CommonEngine, isMainModule} from '@angular/ssr/node';
import express, {Express, NextFunction, Request, Response} from 'express';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import bootstrap from './main.server';
import ProductionConfig from '../configs/Production.json';

const serverDistFolder: string = dirname(fileURLToPath(import.meta.url));
const browserDistFolder: string = resolve(serverDistFolder, '../browser');
const indexHtml: string = join(serverDistFolder, 'index.server.html');

const app: Express = express();
const commonEngine: CommonEngine = new CommonEngine();

app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

app.get('**', (req: Request, res: Response, next: NextFunction): void => {
  const {protocol, originalUrl, baseUrl, headers} = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{provide: APP_BASE_HREF, useValue: baseUrl}],
    })
    .then((html: string): Response => res.send(html))
    .catch((err: Error): void => next(err.stack));
});

if (isMainModule(import.meta.url)) {
  const port: number = ProductionConfig.Server.Port;
  app.listen(port, (): void => {
    console.log(`✔️ Listening on Port ${port}`);
  });
}

export default app;
