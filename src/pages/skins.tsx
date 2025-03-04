import { Group } from '@mantine/core';
import { InferGetServerSidePropsType } from 'next';
import { Layout } from '@/components/layout';
import { PrismaClient } from '@prisma/client';
import { Skin } from '@/components/skins';

export default function Skins({ skins }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout
      title={'Skins - Karlan Tools'}
      centerMain
    >
      <Group
        m="3em 1em"
        position="center"
      >
        {skins.map((skin) => (
          <Skin
            key={skin.id}
            skin={skin}
          />
        ))}
      </Group>
    </Layout>
  );
}

async function getSkins() {
  const prisma = new PrismaClient();

  return await prisma.skin.findMany({
    orderBy: [{ operator: { rarity: 'desc' } }, { operator: { name: 'asc' } }],
    include: {
      operator: true,
    },
  });
}

export async function getServerSideProps() {
  const skins = await getSkins();

  return {
    props: {
      skins,
    },
  };
}
