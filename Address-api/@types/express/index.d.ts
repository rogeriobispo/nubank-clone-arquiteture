import 'express';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      currentUser: CurrentUser;
    }
  }
}
