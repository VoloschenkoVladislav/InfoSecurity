import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import { ROOT_PATH } from '../path';
import axios from 'axios';

const TYPE = {
  asymmetrical: 'asymmetrical',
  symmetrical: 'symmetrical',
};
const ACTION = {
  encrypt: 'encrypt',
  decrypt: 'decrypt',
};
const METHOD = {
  aes128cbc: 'aes-128-cbc',
  blowfish: 'blowfish',
  sm4: 'sm4',
};

const Crypto = () => {
  const [ input, setInput ] = useState('');
  const [ output, setOutput ] = useState('');
  const [ type, setType ] = useState(TYPE.symmetrical);
  const [ action, setAction ] = useState(ACTION.encrypt);
  const [ method, setMethod ] = useState(METHOD.aes128cbc);
  const [ key, setKey ] = useState('');
  const [ iv, setIv ] = useState('');
  const [ publicKey, setPublicKey ] = useState('');
  const [ privateKey, setPrivateKey ] = useState('');
  const [ loadingIv, setLoadingIv] = useState(false);
  
  const generateKey = length => {
    const symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    let out = '';
    for (let i = 0; i < length; i++) {
      out += symbols[Math.floor(Math.random() * 16)];
    }
    return out;
  }
  
  const generateIV = length => {
    if (length && length > 0) {
      setLoadingIv(true);
      axios.get(`${ROOT_PATH}/bbs/generate/${length}`)
      .then(response => {
        setLoadingIv(false);
        setIv(response.data.sequence);
      })
      .catch(error => {
        setLoadingIv(false);
        console.log(error);
      });
    }
  }

  const generatePubPrivKeys = () => {
    axios.get(`${ROOT_PATH}/cripto/key_create.php`)
    .then(response => {
      setPrivateKey(response.data.private_key);
      setPublicKey(response.data.public_key);
    })
    .catch(error => {
      console.log(error);
    });
  }

  const endecode = () => {
    axios.post(`${ROOT_PATH}/cripto/cipher.php`, {
      type: type,
      operation: action,
      word: input,
      method: method,
      key: key,
      iv: iv,
      private_key: privateKey,
      public_key: publicKey,
    })
    .then(response => {
      setOutput(response.data.result)
    })
    .catch(error => {
      console.log(error)
    })
  }

  return (
    <Box>
      <Typography
        variant='h4'
        component='div'
      >
        Шифрование/дешифрование сообщения
      </Typography>
      <Box>
        <TextField
          label='Входная строка'
          variant='standard'
          value={input}
          onChange={e => setInput(e.target.value)}
          sx={{
            marginBottom: 3,
            display: 'inline-block',
          }}
        />
        <Button
          variant="outlined"
          onClick={endecode}
          sx={{
            marginLeft: 2,
            marginRight: 2,
            marginTop: 1.6,
          }}
        >
          { action === ACTION.encrypt ? 'Зашифровать' : 'Расшифровать'} сообщение
        </Button>
        <TextField
          label='Выходная строка'
          variant='standard'
          value={output}
          onChange={e => e.preventDefault()}
          sx={{
            marginBottom: 3,
            display: 'inline-block',
          }}
        />
      </Box>
      <Box>
        <FormControl sx={{
          display: 'inline-block',
          marginRight: 5,
        }}>
          <FormLabel>Тип действия</FormLabel>
          <RadioGroup defaultValue='Шифрование'>
            <FormControlLabel
              label='Шифрование'
              value='Шифрование'
              control={<Radio />}
              onClick={() => setAction(ACTION.encrypt)}
            />
            <FormControlLabel
              label='Дешифрование'
              value='Дешифрование'
              control={<Radio />}
              onClick={() => setAction(ACTION.decrypt)}
            />
          </RadioGroup>
        </FormControl>
        <FormControl sx={{
          display: 'inline-block',
          marginRight: 5,
        }}>
          <FormLabel>Тип шифрования</FormLabel>
          <RadioGroup defaultValue='Симметричное'>
            <FormControlLabel
              label='Симметричное'
              value='Симметричное'
              control={<Radio />}
              onClick={() => setType(TYPE.symmetrical)}
            />
            <FormControlLabel
              label='Асимметричное'
              value='Асимметричное'
              control={<Radio />}
              onClick={() => setType(TYPE.asymmetrical)}
            />
          </RadioGroup>
        </FormControl>
        {
          type === TYPE.symmetrical
          ? <FormControl>
              <FormLabel>Метод шифрования</FormLabel>
              <Select
                value={method}
                label="Метод"
                onChange={e => setMethod(e.target.value)}
              >
                <MenuItem value={METHOD.aes128cbc}>AES-128-CBC</MenuItem>
                <MenuItem value={METHOD.blowfish}>Blowfish</MenuItem>
                <MenuItem value={METHOD.sm4}>SM4</MenuItem>
              </Select>
            </FormControl>
          : null
        }
      </Box>
      {
        type === TYPE.symmetrical
        ? <Box sx={{
          display: 'inline-block',
          marginRight: 5,
          width: 200,
        }}>
            <TextField
              label='Ключ'
              variant='standard'
              value={key}
              onChange={e => setKey(e.target.value)}
              sx={{
                display: 'block',
              }}
            />
            <Button
              variant="text"
              onClick={() => setKey(generateKey(16))}
            >
              Сгенерировать ключ
            </Button>
          </Box>
        : null
      }
      {
        type === TYPE.asymmetrical
        ? <Box sx={{
            display: 'inline-block',
          }}>
          <Box>
            <TextField
              label='Открытый ключ'
              variant='standard'
              value={publicKey}
              onChange={e => e.preventDefault()}
              sx={{ marginRight: 1 }}
            />
            <TextField
              label='Закрытый ключ'
              variant='standard'
              value={privateKey}
              onChange={e => e.preventDefault()}
              sx={{ marginRight: 1 }}
            />
          </Box>
          <Button
            variant="text"
            onClick={generatePubPrivKeys}
          >
           Сгенерировать ключи
          </Button>
        </Box>
        : null
      }
      {
        type === TYPE.symmetrical
        ? <Box sx={{
            display: 'inline-block',
            width: 300,
        }}>
          <TextField
            label='Инициализационный вектор'
            variant='standard'
            value={iv}
            onChange={e => setIv(e.target.value)}
            sx={{
              display: 'block',
            }}
          />
          <Button
            variant="text"
            onClick={() => setIv(generateIV(16))}
          >
            Сгенерировать вектор
          </Button>
        </Box>
        : null
      }
      {
        loadingIv
        ? <CircularProgress sx={{ display: 'inline-block' }} />
        : null
      }
    </Box>
  );
}

export default Crypto;
