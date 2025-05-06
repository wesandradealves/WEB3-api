import { DataSource } from 'typeorm';
import { PrefixTokenEntity } from '@/domain/entities/prefix.token.entity';

export const seedTokens = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(PrefixTokenEntity);

  const tokens = [
    {
      name: 'Dourado Token 1',
      hash: '0xabc123',
      description: 'Token com bonificação em 3 etapas',
      maturityTimeDays: 180,
      yieldPercentage: 10.5,
      isActive: true,
      yieldInterval: 30,
    },
    {
      name: 'Stable Coin Prefix',
      hash: '0xdef456',
      description: 'Token estável com vencimento curto',
      maturityTimeDays: 60,
      yieldPercentage: 5.25,
      isActive: true,
      yieldInterval: 30,
    },
    {
      name: 'Long-Term Crypto Bond',
      hash: '0x987xyz',
      description: 'Token prefixado de longo prazo',
      maturityTimeDays: 360,
      yieldPercentage: 15.0,
      isActive: true,
      yieldInterval: 90,
    },
  ];

  await Promise.all(tokens.map((token) => repo.save(repo.create(token))));
  console.log('✅ Tokens de exemplo inseridos com sucesso!');
};
