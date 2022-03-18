type typeName = '__HandleError__';

interface HandleErrorJson {
  __type__: typeName,
  __code__: number,
  __message__: string,
}

export default class HandleError extends Error {
  code = 500;

  constructor(msg: string, code?: number) {
    super(msg);

    if (!code) {
      return;
    }

    this.code = code;
  }

  toJSON(): HandleErrorJson {
    return {
      __type__: '__HandleError__',
      __code__: this.code,
      __message__: this.message,
    };
  }
}
