import { format } from 'date-fns';

export const timeLog = (req: { url: string }, res: any, next: () => void) => {
  console.log(`Path: /articles${req.url}, Time: ${format(Date.now(), 'dd-MM-yyyy HH:mm:ss')}`);
  next();
};
