import { send } from '../channel';

// TODO: use the original criteria class from admin
interface Criteria {
  associations?: string[],
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (entityName: string) => ({
  get: (id: string, criteria?: Criteria): Promise<unknown> => {
    return send('repositoryGet', {
      entityName: entityName,
      id: id,
      criteria: criteria,
    });
  },
});

export type repositoryGet = {
  responseType: unknown,
  entityName: string,
  id: string,
  criteria?: Criteria,
}