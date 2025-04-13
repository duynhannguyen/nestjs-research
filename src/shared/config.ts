import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config({
  path: '.env',
});

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('.env file not found. ');
  process.exit(1);
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string;
  @IsString()
  ACCESS_TOKEN_SECRET: string;
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;
  @IsString()
  REFRESH_TOKEN_SECRET: string;
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;
  @IsString()
  SECRET_KEY: string;
}
const configServer = plainToInstance(ConfigSchema, process.env);
const errorArray = validateSync(configServer);
if (errorArray.length > 0) {
  console.log('value in env is not valid ');
  const error = errorArray.map((err) => {
    return {
      property: err.property,
      constraints: err.constraints,
      value: err.value,
    };
  });
  throw error;
}

const envConfig = configServer;
export default envConfig;
