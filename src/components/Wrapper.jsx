import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  List,
  ListItem,
  Typography,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Bbs from './Bbs';
import HashFunction from './HashFunction';
import Crypto from './Crypto';

const Wrapper = () => {
  const [ open, setOpen ] = useState(false);
  const [ labNum, setLabNum ] = useState(2);

  const labList = [
    {
      name: 'Хэш-функции',
      component: <HashFunction />,
    },
    {
      name: 'Псевдослучайные последовательности',
      component: <Bbs />,
    },
    {
      name: 'Кодирование',
      component: <Crypto />
    }
  ];

  return (
    <Box>
      <AppBar
        position='static'
      >
        <Toolbar>
          <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {labList[labNum].name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
      >
        <List>
          {
            labList.map((item, ind) => {
              return (
                <>
                  <ListItem button onClick={() => { setLabNum(ind); setOpen(false) } }>
                    <Typography>
                      ЛР №{ind+1}: {item.name}
                    </Typography>
                  </ListItem>
                  <Divider />
                </>
              );
            })
          }
        </List>
      </Drawer>
      <Box sx={{ padding: 2 }}>
        {labList[labNum].component}
      </Box>
    </Box>
  )
}

export default Wrapper;
