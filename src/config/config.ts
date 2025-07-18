import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  accessSecretKey: process.env.ACCESS_SECRET_KEY,
  refreshSecretKey: process.env.REFRESH_SECRET_KEY,
  recoverySecretKey: process.env.RECOVERY_SECRET_KEY,
  env: process.env.NODE_ENV || 'dev',
  apiUrl: process.env.API_URL || 'http://localhost:3001',
}));
