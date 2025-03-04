import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { Box, Text } from '@mantine/core';
import { useRef } from 'react';

dayjs.extend(LocalizedFormat);
dayjs.extend(RelativeTime);

interface EventDateProps {
  estimatedStart: Date | null;
  enStart: Date | null;
  enEnd: Date | null;
}

export function EventDate({ enStart, enEnd, estimatedStart }: EventDateProps) {
  const estimatedDate = useRef<dayjs.Dayjs | undefined>(estimatedStart ? dayjs(estimatedStart) : undefined).current;
  const enStartDate = useRef<dayjs.Dayjs | undefined>(enStart ? dayjs(enStart) : undefined).current;
  const enEndDate = useRef<dayjs.Dayjs | undefined>(enEnd ? dayjs(enEnd) : undefined).current;

  const shouldShowTentativeDate = !enStartDate && estimatedDate;
  const shouldShowExactDate = enStartDate;

  const isStarted = useRef(!!enStartDate && dayjs().isAfter(enStartDate)).current;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1em 1fr 1em',
        gridTemplateAreas: `
          ". date ."
          ". info ."
        `,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {shouldShowTentativeDate && (
        <>
          <Text
            sx={{
              gridArea: 'date',
              textAlign: 'center',
            }}
          >
            <strong css={{ marginRight: '2em' }}>Tentative Date</strong>
            {estimatedDate.format('ll')}
          </Text>
          <Text
            sx={{
              gridArea: 'info',
              textAlign: 'center',
            }}
          >
            (starts {dayjs().to(estimatedDate)})
          </Text>
        </>
      )}
      {shouldShowExactDate && (
        <>
          <Text
            sx={{
              gridArea: 'date',
              textAlign: 'center',
            }}
          >
            {enStartDate.format('ll')}
            {enEndDate && (
              <>
                <span css={{ marginInline: '0.5em' }}>-</span>
                {enEndDate.format('ll')}
              </>
            )}
          </Text>
          <Text
            ml={4}
            sx={{
              gridArea: 'info',
              textAlign: 'center',
            }}
          >
            {!isStarted && <>(starts {dayjs().to(enStartDate)})</>}
            {isStarted && enEndDate && <>(ends {dayjs().to(enEndDate)})</>}
          </Text>
        </>
      )}
    </Box>
  );
}
