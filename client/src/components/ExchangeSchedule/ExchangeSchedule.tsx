import React, { Component, FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Box, Button, TextField, Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

type ExchangeScheduleFormData = {
    from: string;
    to: string;
    exchange: string;
};

type ExchangeScheduleFormProps = {
  SetExchangeSchedule: (schedule: any) => void;
  SetServerError: (error: any) => void;
};

type ExchangeScheduleTableProps = {
  ExchangeScheduleData?: any;
  ServerError?: any;
}

const ExchangeScheduleForm: FC<ExchangeScheduleFormProps> = (
  { SetExchangeSchedule, SetServerError },
) => {
  const defaultDate = moment().format();
  const {
    control, register, handleSubmit, watch, formState: { errors },
  } = useForm<ExchangeScheduleFormData>({ defaultValues: { from: defaultDate, to: defaultDate } });

  const onSubmit = (data: ExchangeScheduleFormData) => {
    SetServerError(null);
    fetch('/api/get-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (!response.ok) {
        response.json().then((err) => SetServerError(err));
      }
      return response.json();
    }).then((result) => {
      SetExchangeSchedule(result);
    })
      .catch((err) => SetServerError(err));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Controller
            name="from"
            control={control}
            render={({
              field: { onChange, value },
            }) => (
              <DatePicker
                value={value}
                onChange={(newValue) => onChange(moment(newValue).format())}
                label="Date from"
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            )}
          />
          <Controller
            name="to"
            control={control}
            render={({
              field: { onChange, value },
            }) => (
              <DatePicker
                value={value}
                onChange={(newValue) => onChange(moment(newValue).format())}
                label="Date to"
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            )}
          />
        </LocalizationProvider>
        <TextField
          id="outlined"
          label="Exchange"
          defaultValue="MOEX"
          size="small"
          {...register('exchange')}
        />

        <Button variant="contained" type="submit" size="medium">Submit</Button>
      </Box>
    </form>
  );
};

const withID = (array: any[]) => array.map((item: any) => {
  // eslint-disable-next-line no-param-reassign
  item.id = uuid();
  return item;
});

const ExchangeScheduleTableColumns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'date',
    flex: 1,
    valueGetter: (params: any) => moment(params.row.date).format('DD/MM/YY'),
  },
  {
    field: 'isTradingDay',
    headerName: 'Is Trading Day',
    flex: 1,
    valueGetter: (params: any) => (params.row.isTradingDay ? 'YES' : 'NO'),
  },
  {
    field: 'startTime',
    headerName: 'starting trading time (hours/minutes/seconds)',
    flex: 1,
    valueGetter: (params: any) => (params.row.startTime ? moment(params.row.startTime).format('hh:mm:ss') : ''),
  },
  {
    field: 'endTime',
    headerName: 'ending trading time (hours/minutes/seconds)',
    flex: 1,
    valueGetter: (params: any) => (params.row.endTime ? moment(params.row.endTime).format('hh:mm:ss') : ''),
  },
];

const ExchangeScheduleTable: FC<ExchangeScheduleTableProps> = (
  { ExchangeScheduleData, ServerError },
) => {
  if (ServerError) {
    return <Typography>{JSON.stringify(ServerError)}</Typography>;
  }

  if (!ExchangeScheduleData) {
    return null;
  }

  return (
    <>
      {ExchangeScheduleData.exchanges.map(((exchange: any) => (
        <div key={uuid()}>
          <Typography>{exchange.exchange}</Typography>
          <DataGrid
            rows={withID(exchange.days)}
            columns={ExchangeScheduleTableColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
          />
        </div>
      )))}
    </>
  );
};

export const ExchangeSchedule: FC = () => {
  const [ExchangeScheduleData, SetExchangeSchedule] = useState(null);
  const [ServerError, SetServerError] = useState(null);

  return (
    <>
      <ExchangeScheduleForm
        SetExchangeSchedule={SetExchangeSchedule}
        SetServerError={SetServerError}
      />
      <ExchangeScheduleTable
        ExchangeScheduleData={ExchangeScheduleData}
        ServerError={ServerError}
      />
    </>
  );
};
