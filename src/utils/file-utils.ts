import { extname } from 'path';

export const editFileName = (req: any, file: any, callback: any) => {
  try {
    if (!file || !file.originalname) {
      return callback(new Error('Invalid file data'), null);
    }

    const fileExtName = extname(file.originalname);
    if (!fileExtName) {
      return callback(new Error('File must have an extension'), null);
    }

    const randomName = Array(8)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    const filename = `${randomName}${fileExtName}`;
    callback(null, filename);
  } catch (error) {
    callback(error, null);
  }
};
