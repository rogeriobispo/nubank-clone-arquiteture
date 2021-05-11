import { v4 as uuidv4 } from 'uuid';

const originAccount = uuidv4();
const destinyAccount = uuidv4();

interface AxiosRequestConfig {
  headers?: any;
}
interface Axios {
  get: (url: string, config: AxiosRequestConfig) => void;
}

const currentUser = {
  id: uuidv4(),
  name: 'John',
  email: 'john@gmail.com',
};

const successAuthorization = {
  data: {
    ...currentUser,
  },
};

const create = (): Axios => {
  return {
    get(url: string, config: AxiosRequestConfig) {
      const { authorization } = config.headers;

      if (!authorization) throw new Error('invalid token');

      return successAuthorization;
    },
  };
};
const mockedAxios = {
  create,
};

export { currentUser, Axios, originAccount, destinyAccount };
export default mockedAxios;
