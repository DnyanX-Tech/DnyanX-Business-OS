import { createApp } from '../src/app.js';
import type { IncomingMessage, ServerResponse } from 'http';

const app = createApp();

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return (app as any)(req, res);
}
