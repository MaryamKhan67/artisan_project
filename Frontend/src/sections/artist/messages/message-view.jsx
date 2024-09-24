import { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { CircularProgress, Box, TextField, Grid, List, ListItemText, ListItemButton, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Iconify from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';

export default function MessageView() {
  const navigate = useNavigate();
  const artistID = localStorage.getItem('artistID');
  if (!artistID) {
    navigate("/artist/login");
  }

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  useEffect(() => {
    axios.get(`http://localhost:8080/api/artist/messages/users/${artistID}`)
      .then(response => {
        setUsers(response.data.users);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching artists', error);
        setLoading(false);
      });
  }, [artistID]);

  const fetchMessages = (userID) => {
    setActiveUser(userID);
    axios.get(`http://localhost:8080/api/artist/messages/${userID}/${artistID}`)
      .then(response => {
        setMessages(response.data.messages);
      })
      .catch(error => {
        console.error('Error fetching messages', error);
      });
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (activeUser) {
      const interval = setInterval(() => {
        axios.get(`http://localhost:8080/api/artist/messages/${activeUser}/${artistID}`)
          .then(response => {
            setMessages(response.data.messages);
          })
          .catch(error => {
            console.error('Error fetching messages', error);
          });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [activeUser, artistID]);

  const handleSendMessage = () => {
    setSending(true)
    if (newMessage.trim() === '') return;

    try {
      axios.post(`http://localhost:8080/api/artist/messages/send-message`, {
        userID: activeUser,
        artistID,
        message: newMessage,
        sender: artistID
      })
        .then(response => {
          setMessages([...messages, response.data.message]);
          setNewMessage('');
        })
        .catch(error => {
          console.error('Error sending message', error);
        });
    } catch (e) {
      console.log(e)
    } finally {
      setSending(false)
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Messages</Typography>
        </Stack>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="80vh"
          textAlign="center"
        >
          <Iconify icon="mdi:message" width={100} height={100} style={{ color: '#ccc' }} />
          <Typography variant="h4" mt={3} marginBottom={1}>Your Inbox is Empty</Typography>
          <Typography variant="body1" marginBottom={3}>
            Looks like you haven’t messaged any artist yet.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Messages</Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <List component="nav">
            {users.map((user) => (
              <ListItemButton
                key={user._id}
                onClick={() => fetchMessages(user._id)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  boxShadow: activeUser === user._id ? '0px 0px 20px rgba(0,0,0,0.2)' : 'none',
                  backgroundColor: activeUser === user._id ? '#f5f5f5' : 'white',
                  transition: 'background-color 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <ListItemText primary={user.userName} />
              </ListItemButton>
            ))}
          </List>
        </Grid>

        <Grid item xs={8}>
          <Typography variant="h6" gutterBottom>
            {activeUser ? `Messages with ${users.find(a => a._id === activeUser)?.userName}` : 'Select a User'}
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            height="500px"
            border="1px solid #ccc"
            borderRadius={2}
            padding={2}
            boxShadow="0px 0px 10px rgba(0,0,0,0.1)"
            overflow="auto"
          >
            {messages.length > 0 ? messages.map((msg, index) => (
              <Box
                key={index}
                mb={2}
                display="flex"
                flexDirection="column"
                alignItems={msg.sender !== artistID ? 'flex-start' : 'flex-end'}
              >
                <Box
                  padding={1.5}
                  borderRadius={10}
                  maxWidth="70%"
                  bgcolor={msg.sender !== artistID ? 'grey.200' : 'primary.light'}
                  boxShadow="0px 0px 5px rgba(0,0,0,0.1)"
                >
                  <Typography variant="body1" color={msg.sender !== artistID ? 'black' : 'white'}>
                    {msg.message}
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 0.5 }}
                >
                  {new Date(msg.timestamp).toLocaleString()}
                </Typography>
              </Box>
            )) : (
              <Typography variant="body2" color="textSecondary">
                No messages yet.
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>


          <Box mt={2} display="flex" alignItems="center">
            <TextField
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={!activeUser}
              loading={sending}
              sx={{ marginLeft: 2, borderRadius: 2 }}
            >
              Send
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}