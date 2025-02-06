import { Request, Response, Router } from 'express';

export const healthRoute = Router().get('/health', (_: Request, res: Response) => {
  res.status(200).send('OK');
});
