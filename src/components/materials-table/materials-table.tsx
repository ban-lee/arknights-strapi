import Image from 'next/image';
import { Box, createStyles, Flex, Group, MantineTheme, rem, ScrollArea, Stack, Table, Text } from '@mantine/core';
import { CloudinaryImage } from '@/types/keystone-types';
import { EventDate } from '../event/event-date';
import { largeOrMore, lessThanSmall, smallOrMore } from '@/utils/media-query';
import { Material as MaterialComponent } from '../materials/material';
import { Material, Prisma } from '@prisma/client';
import { useEffect, useState } from 'react';

const event = Prisma.validator<Prisma.EventArgs>()({
  select: {
    id: true,
    name: true,
    estimatedStart: true,
    enStart: true,
    enEnd: true,
    headerImg: true,
    materials: true,
  },
});

type Event = Prisma.EventGetPayload<typeof event>;

interface Props {
  events: Event[];
  materials: Material[];
}

interface DisplayRow {
  event: Event;
  materialIndices: boolean[];
}

const useStyles = createStyles((theme: MantineTheme) => ({
  tableArea: {
    [`@media ${lessThanSmall(theme)}`]: {
      maxWidth: 'calc(100vw - 390px)',
    },
    [`@media ${smallOrMore(theme)}`]: {
      maxWidth: 'calc(100vw - 200px - 390px)',
    },
    [`@media ${largeOrMore(theme)}`]: {
      maxWidth: 'calc(100vw - 300px - 390px)',
    },
  },
  table: {
    backgroundColor: theme.colors.gray[9],
    tableLayout: 'fixed',

    borderLeft: '0',
  },
  eventCell: {
    position: 'relative',
    outline: `${rem(1)} solid ${theme.colors.dark[4]}`,
    outlineOffset: -1,

    '&:hover': {
      '> div:after': {
        opacity: 1,
      },
    },
  },
  eventCellDate: {
    position: 'absolute',
    bottom: 1,
    left: 1,
    width: 'calc(100% - 2px)',
    padding: '4px 0',

    '&:after': {
      content: '""',
      position: 'absolute',
      display: 'block',
      top: 0,
      height: '100%',
      width: '100%',

      backgroundColor: theme.colors.gray[9],
      opacity: 0.75,
      zIndex: 5,
    },

    '.text': {
      zIndex: 10,
    },
  },
  materialCell: {
    width: 75,
    height: 125,
  },
}));

export function MaterialsTable({ events, materials }: Props) {
  const { classes } = useStyles();
  const [displayRows, setDisplayRows] = useState<DisplayRow[]>([]);
  const [displayCols, setDisplayCols] = useState<boolean[]>(Array(materials.length).fill(false));

  useEffect(() => {
    const newRows: DisplayRow[] = [];
    for (const event of events) {
      const row: DisplayRow = {
        event,
        materialIndices: Array(materials.length).fill(false),
      };

      for (const material of event.materials) {
        const index = materials.findIndex((mat) => mat.id === material.id);
        if (index < 0) throw new Error(`Could not find material [${material.id} - ${material.name}]`);

        row.materialIndices[index] = true;
        setDisplayCols((cols) => {
          cols[index] = true;
          return cols;
        });
      }

      newRows.push(row);
    }

    setDisplayRows(() => newRows);
  }, [events, materials]);

  return (
    <Flex>
      <Stack spacing={0}>
        {displayRows.map((row) => {
          return (
            <Box
              key={row.event.id}
              className={classes.eventCell}
            >
              <Image
                src={(row.event.headerImg as unknown as CloudinaryImage)._meta.secure_url || ''}
                alt={`${row.event.name} event banner`}
                css={{
                  objectFit: 'cover',
                }}
                width={390}
                height={125}
                priority
              />
              <Box className={classes.eventCellDate}>
                <Stack spacing={2}>
                  <Text
                    weight="bold"
                    align="center"
                    className={`text`}
                  >
                    {row.event.name}
                  </Text>
                  <Box className={`text`}>
                    <EventDate
                      estimatedStart={row.event.estimatedStart}
                      enStart={row.event.enStart}
                      enEnd={row.event.enEnd}
                    />
                  </Box>
                </Stack>
              </Box>
            </Box>
          );
        })}
      </Stack>
      <ScrollArea className={classes.tableArea}>
        <Table
          horizontalSpacing={0}
          verticalSpacing={0}
          withBorder
          withColumnBorders
          className={classes.table}
        >
          <tbody>
            {displayRows.map((row) => {
              return (
                <tr key={row.event.id}>
                  {row.materialIndices.map((value, index) => {
                    if (!displayCols[index]) return <></>;

                    const mat = materials[index];
                    return (
                      <td
                        key={mat.id}
                        className={classes.materialCell}
                      >
                        <Group
                          align="center"
                          position="center"
                          aria-label={`Material dropped during ${row.event.name}`}
                        >
                          {value && <MaterialComponent material={mat} />}
                        </Group>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ScrollArea>
    </Flex>
  );
}
