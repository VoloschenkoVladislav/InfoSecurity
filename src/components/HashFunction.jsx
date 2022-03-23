import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ROOT_PATH } from '../path';
import axios from 'axios';

const Wrapper = styled(Paper)(() => ({
  backgroundColor: '#fff',
  height: 300,
  padding: 80,
  backgroundColor: '#efefef',
}));

const Input = styled(TextField)(() => ({
  marginBottom: 10
}));

const Graphic = ({ data }) => {
  return (
    <LineChart width={600} height={300} data={data}>
      <Line type="monotone" dataKey="bits" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="iteration" />
      <YAxis />
    </LineChart>
  );
};

const HashFunction = () => {
  const [ value, setValue ] = useState('');
  const [ hash, setHash ] = useState('');
  const [ bit, setBit ] = useState('');
  const [ string, setString ] = useState('');
  const [ graphicData, setGraphicData ] = useState({});
  const [ error, setError ] = useState({
    value: false,
    bit: false,
    string: false
  });

  const getHash = () => {
    const re = /^[a-zA-Zа-яА-Я_]*$/;
    setError({ ...error, value: !re.test(value)});
    if (!re.test(value)) {
      return;
    };

    axios.get(`${ROOT_PATH}/sha384/hash/${value}`)
    .then(response => {
      const newHash = response.data.hash
      setHash(newHash);
    })
    .catch(error => {
      console.log(error);
    });
  };

  const getGraphic = () => {
    const re = /^[a-zA-Zа-яА-Я_]+$/;
    setError({ ...error, bit: !(bit < string.length*8-1 && bit > 0 && bit), string: !re.test(string) });
    if (!re.test(string) || bit > string.length*8-1 || bit < 0 && !bit) {
      return;
    };

    axios.get(`${ROOT_PATH}/sha384/avalanche/${string}/${bit}`)
    .then(response => {
      const data = response.data.bits_changed;
      setGraphicData(data.map((e, i) => ({bits: e, iteration: i + 1})));
    })
    .catch(error => {
      console.log(error);
    });
  }

  return (
    <Grid 
      container
      spacing={6}
    >
      <Grid item xs={4}>
        <Wrapper>
          <Input
            label="Входная строка"
            variant="standard"
            value={value}
            onChange={ e => setValue(e.target.value) }
            error={error.value}
            helperText={error.value ? "Допустимы только буквы и знак подчеркивания" : null}
            sx={{
              display: 'block',
              marginBottom: 1
            }}
          />
          <Button variant="contained" onClick={getHash}>Вычислить хэш</Button>
          <Input
            label="Вычисленный хэш"
            multiline
            maxRows={4}
            value={hash}
            onChange={ e => e.preventDefault() }
            sx={{
              width: 400,
              marginTop: 5
            }}
          />
        </Wrapper>
      </Grid>
      <Grid item xs={8}>
        <Wrapper>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Input
                label="Изменяемый бит"
                variant="standard"
                value={bit}
                onChange={ e => setBit(e.target.value) }
                error={error.bit}
                helperText={error.bit ? "Число выходит за диапазон 0 ~ N*8-1" : null}
                sx={{
                  display: 'block',
                  marginBottom: 1
                }}
              />
              <Input
                label="Входная строка"
                variant="standard"
                value={string}
                onChange={ e => setString(e.target.value) }
                error={error.string}
                helperText={error.string ? "Допустимы только буквы и знак подчеркивания" : null}
                sx={{
                  display: 'block',
                  marginBottom: 1
                }}
              />
              <Button variant="contained" onClick={getGraphic}>Построить график</Button>
            </Grid>
            <Grid item xs={8}>
              <Graphic data={graphicData} />
            </Grid>
          </Grid>
        </Wrapper>
      </Grid>
    </Grid>
  );
}

export default HashFunction;
