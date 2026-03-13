import { NextFunction, Request, Response } from 'express';

export function rateLimit(maxRequests: number, windowMs: number) {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const now = Date.now();

    if (!requests.has(ip!)) {
      requests.set(ip!, []);
    }

    const userRequests = requests.get(ip!);
    const recentRequests = userRequests?.filter(
      (time) => now - time < windowMs,
    );

    if (recentRequests!.length >= maxRequests) {
      return res.send(429).json({ message: 'Too many requests' });
    }

    requests.set(ip!, [...userRequests!, now]);
    next();
  };
}
