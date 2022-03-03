import { send } from '../channel';

// TODO: just testing
interface Context {
  foo: string,
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (entityName: string) => ({
  get: (id: string, context: Context): Promise<unknown> => {
    return send('repositoryGet', {
      entityName: entityName,
      id: id,
      context: context,
    });
  },
});

export type repositoryGet = {
  entityName: string,
  id: string,
  context: Context,
  responseType: unknown,
}