import dayjs from 'dayjs';
import Image from 'next/image';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { AkHeader, Event, Material } from '@/types/payload-types';
import { Card, Grid, Group, Text, Title } from '@mantine/core';
import { Materials } from '@/components/materials';
import { useRef } from 'react';

dayjs.extend(LocalizedFormat);
dayjs.extend(RelativeTime);

interface EventProps {
  event: Event;
}

export function Event({ event }: EventProps) {
  const estimatedStart = useRef<dayjs.Dayjs | undefined>(
    event.dates.estimatedStart ? dayjs(event.dates.estimatedStart) : undefined
  ).current;

  return (
    <>
      <Card
        sx={{
          width: 780,
        }}
      >
        {event.header && (
          <Card.Section>
            <Image
              src={(event.header as AkHeader).url || ''}
              css={{
                objectFit: 'cover',
              }}
              width={780}
              height={250}
              alt={`${event.name} event banner`}
            />
          </Card.Section>
        )}
        <Card.Section mb={16}>
          <Title
            order={2}
            align="center"
            py={12}
          >
            {event.name}
          </Title>
        </Card.Section>
        <Grid align="center">
          {estimatedStart && (
            <>
              <Grid.Col span={2}>
                <Text weight="bold">Tentative EN:</Text>
              </Grid.Col>
              <Grid.Col span={10}>
                <Group>
                  <Text>{estimatedStart.format('ll')}</Text>
                  <Text>({dayjs().to(estimatedStart)})</Text>
                </Group>
              </Grid.Col>
            </>
          )}
          {event.materials && (
            <>
              <Grid.Col span={2}>
                <Text weight="bold">Materials:</Text>
              </Grid.Col>
              <Grid.Col span={10}>
                <Materials materials={(event.materials || []) as Material[]} />
              </Grid.Col>
            </>
          )}
        </Grid>
      </Card>
    </>
  );
}
