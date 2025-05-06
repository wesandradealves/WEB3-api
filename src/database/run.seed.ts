import { DataSource } from 'typeorm';
import { seedTokens } from './seeds/token.seed';
import { PrefixTokenEntity } from 'src/domain/entities/prefix.token.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'dourado',
  entities: [PrefixTokenEntity],
  synchronize: false,
});

AppDataSource.initialize()
  .then(async () => {
    console.log('🚀 Conectado ao banco com sucesso.');
    await seedTokens(AppDataSource);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Erro ao rodar seed:', err);
    process.exit(1);
  });
