import { prisma } from '../DB/prismaConfig';

const deleteAllRefreshTokens = async (id: number) => {
  const query = {
    where: {
      id,
    },
    data: {
      refresh_tokens: [],
    },
  };
  await prisma.operators.update(query);
};

export default deleteAllRefreshTokens;
