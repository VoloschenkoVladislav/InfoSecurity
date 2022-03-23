import React, { useState } from 'react';
import {
  Grid,
  Button,
  Alert,
  Box,
  TextField,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import { ROOT_PATH } from '../path';
import axios from 'axios';

const config2 = {
  headers: {
    SECRET_KEY: 'cygaloh',
  },
};

const Bbs = () => {
  const [ length, setLength ] = useState(10);
  const [ sequence, setSequence ] = useState('');
  const [ frequencyTest, setFrequencyTest ] = useState(null);
  const [ sameBitTest, setSameBitTest ] = useState(null);
  const [ wideTest, setWideTest ] = useState(null);
  const [ xiSq, setXiSq ] = useState(null)
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(false);

  const generate = length => {
    setError(false);
    if (length && length > 0) {
      setLoading(true);
      axios.get(`${ROOT_PATH}/bbs/generate/${length}`)
      .then(response => {
        setSequence(response.data.sequence);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
    }
    else {
      setError(true);
    }
  }

  const test = seq => {
    axios.get(`${ROOT_PATH}/bbs/test/${seq}`, config2)
    .then(response => {
      const { test1, test2, test3, xi_sq } = response.data;
      setFrequencyTest(test1);
      setSameBitTest(test2);
      setWideTest(test3);
      setXiSq(xi_sq);
    })
    .catch(error => {
      console.log(error);
    })
  }
  
  return (
    <Grid sx = {{
      marginLeft: 2,
    }}>
      <Grid>
        <Typography
          variant='h6'
          component='div'
          sx = {{
            marginBottom: 2
          }}
        >
          Сгенерировать псведослучайную последовательность
        </Typography>
        <TextField
          error={error}
          label='Длина последовательности'
          variant='standard'
          value={length}
          onChange={e => setLength(e.target.value)}
          sx = {{
            display: 'block',
            marginBottom: 2,
          }}
          helperText={error ? 'Введите корректное число длины': null}
        />
        {
          !loading
          ? <Button
            variant='contained'
            onClick={() => generate(length)}
            sx={{
              display: 'block',
              marginBottom: 2,
            }}
          >
            Сгенерировать
          </Button>
          : <CircularProgress />
        }
        <TextField
          label="Сгенерированная последовательность"
          variant="standard"
          value={sequence}
          sx = {{
            display: 'block',
            minWidth: 300,
            marginBottom: 2,
          }}
          onChange={e => e.preventDefault()}
        />
      </Grid>
      <Divider />
      <Grid sx={{
        maxWidth: 500,
        marginTop: 2,
      }}>
        <Typography
          variant='h6'
          component='div'
          sx = {{
            marginBottom: 2
          }}
        >
          Протестировать сгенерированную последовательность на "случайность"
        </Typography>
        <Button
          variant='contained'
          onClick={() => { test(sequence) }}
          sx={{
            marginBottom: 2
          }}
        >
          Запустить тест
        </Button>
        {
          frequencyTest
          ? <Box sx={{
            marginBottom: 2
          }}>
            {
              frequencyTest.res
              ? <Alert severity='success'>Частотный тест пройден успешно.<br /> Значение статистики: { frequencyTest.s }</Alert>
              : <Alert severity='error'>Частотный тест не пройден.<br /> Значение статистики: { frequencyTest.s }</Alert>
            } 
          </Box>
          : null
        }
        {
          sameBitTest && frequencyTest.res
          ? <Box sx={{
            marginBottom: 2
          }}>
            {
              sameBitTest.res
              ? <Alert severity='success'>Тест на последовательность одинаковых бит пройден успешно.<br /> Значение статистики: { sameBitTest.s }</Alert>
              : <Alert severity='error'>Тест на последовательность одинаковых бит не пройден.<br /> Значение статистики: { sameBitTest.s }</Alert>
            } 
          </Box>
          : null
        }
        {
          xiSq
          ? <Box sx={{
            marginBottom: 2
          }}>
            {
              xiSq.res
              ? <Alert severity='success'>Тест хи-квадрат пройден успешно.<br /> Значение статистики: { xiSq.p }</Alert>
              : <Alert severity='error'>Тест хи-квадрат не пройден.<br /> Значение статистики: { xiSq.p }</Alert>
            }
          </Box>
          : null
        }
        {
          wideTest && frequencyTest.res
          ? <Box sx={{
            marginBottom: 2
          }}>
            {
              wideTest.map(item => item.res).reduce((prev, cur) => prev && cur, true)
              ? <Alert severity='success'>
                  Расширенный тест на произвольные отклонения пройден успешно.<br/>
                  Статистических тестов пройдено: {wideTest.filter(item => item.res).length}/18<br/>
                  Значения статистик:<br/>
                  {wideTest.map(item => <span>j = {item.j}; s = {item.y}<br/></span>)}
                </Alert>
              : <Alert severity='error'>
                  Расширенный тест на произвольные отклонения не пройден.<br/>
                  Статистических тестов пройдено: {wideTest.filter(item => item.res).length}/18<br/>
                  Значения статистик:<br/>
                  {wideTest.map(item => <span>j = {item.j}; s = {item.y}<br/></span>)}
                </Alert>
            }
            <Box>
              <Typography component='div'></Typography>
            </Box>
          </Box>
          : null
        }
      </Grid>
    </Grid>
  );
}

export default Bbs;
