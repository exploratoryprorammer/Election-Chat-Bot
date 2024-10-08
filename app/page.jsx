'use client'
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Box, Stack, TextField, Button, Modal, Typography, InputBase, Card } from "@mui/material";
import { faMeta } from "@fortawesome/free-brands-svg-icons";
import { faM, faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRuler, faFileAlt, faBolt, faMeteor, faCalendarAlt, faAngleUp, faStar, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [pages, setPages] = useState(0);
  const [selast, setSelast] = useState(null);
  const [index, setIndex] = useState(null);
  const [modalopen, setModalopen] = useState(false);
  const [smallscreen, setSmallscreen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const smallwindowdetection = () => {
        setSmallscreen(window.innerWidth < 1526)
      };

      window.addEventListener('resize', smallwindowdetection);
      console.log(window.innerWidth);

      smallwindowdetection();

      return () => {
        window.removeEventListener('resize', smallwindowdetection);
      }

    }
  }, []);

  const handlemodalopen = (asteroid) => {
    setSelast(asteroid);
    setModalopen(true);
    setIndex(getNextApproachingDateIndex(asteroid.close_approach_data));
    console.log(index);
  }

  useEffect(() => {
    if (index !== null) {
      console.log(index);
    }
  }, [index]);

  const handlemodalclose = () => {
    setSelast(null);
    setModalopen(false);

  }


  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi Im the NASA asteroid detention A.I. assistant`
  }])

  const [message, setMessage] = useState('')

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role: 'user', content: message},
      {role: 'assistant', content: ''},
    ])
  
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ''
  
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {...lastMessage, content: lastMessage.content + text},
          ]
        })
        return reader.read().then(processText)
      })
    })
  }
  const handleopen = () => setOpen(true);
  const handleclose = () => setOpen(false);

  useEffect(() => {
    const fetchNASAdata = async () => {
      try {
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=53NkhqrDI4PURDLYfDVzIAw7rvXSuUFE5o2a4Tyq`);
        const result = await response.json();
        setData(result);
        setPages(result.page.total_pages)
      }
      catch (error) {
        console.log(error)
      }
    };

    fetchNASAdata();
  }, []);



  const getNextApproachingDate = (closeApproachData) => {
    // Get the current date
    const now = new Date();

    // Filter for dates in the future
    const futureApproaches = closeApproachData.filter(data => new Date(data.close_approach_date) > now);

    // Find the nearest date
    if (futureApproaches.length === 0) {
      return 'No future approaches';
    }

    const nextApproach = futureApproaches.reduce((earliest, current) => {
      return new Date(current.close_approach_date) < new Date(earliest.close_approach_date) ? current : earliest;
    });

    return nextApproach.close_approach_date_full;
  };

  const getNextApproachingDateIndex = (closeApproachData) => {
    const now = new Date();

    const futureApproaches = closeApproachData
      .map((data, index) => ({ ...data, index }))
      .filter(({ close_approach_date }) => new Date(close_approach_date) > now);

    if (futureApproaches.length === 0) {
      return 'No future approaches';
    }

    const nextApproach = futureApproaches.reduce((earliest, current) => {
      return new Date(current.close_approach_date) < new Date(earliest.close_approach_date) ? current : earliest;
    });

    return nextApproach.index;
  };
  const backgroundImageStyle = {
    backgroundImage: 'url(https://i.pinimg.com/originals/1a/7d/cc/1a7dcc374628bc21f6ef890463a77eae.png)',
    backgroundPosition: 'center',
    height: '100vh',
    color: 'white',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  useEffect(() => {
    scrollToBottom()
  }, [messages])









  return (
    <Box style={backgroundImageStyle}>
      {smallscreen ? <Typography variant="h1">NEOs</Typography> : <Typography variant="h1">REAL TIME NEAR EARTH OBJECTS</Typography>}

      {smallscreen ?
        <Typography
          variant="h1"
          color="white"
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Image
            src="/openai-white-logomark.png"
            width="50"
            height='100'
            alt="NASA Logo"
            style={{
              marginTop: '0',
              height: '90px',
              width: 'auto',
            }}
          />
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
            width="50"
            height='100'
            alt="NASA Logo"
            style={{
              marginTop: '0',
              height: '100px',
              width: 'auto',
            }}
          />

        </Typography>
        :
        <Typography
          variant="h1"
          color="white"
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Typography variant="h2">POWERED BY</Typography>
          <Image
            src="/openai-white-logomark.png"
            width="50"
            height='100'
            alt="NASA Logo"
            style={{
              marginTop: '0',
              height: '90px',
              width: 'auto',
            }}
          />
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
            width="50"
            height='100'
            alt="NASA Logo"
            style={{
              marginTop: '0',
              height: '100px',
              width: 'auto',
            }}
          />

        </Typography>}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          width: 'auto',
          height: 'auto',
          overflowY: 'auto',
          padding: '16px',
          boxSizing: 'border-box',
        }}
      >
        {data?.near_earth_objects.map((asteroid) => (
          <Box
            key={asteroid.id}
            sx={{
              width: '300px',
              height: '175px',
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              p: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            onClick={() => handlemodalopen(asteroid)}
          >
            <Typography variant="h6">{asteroid.name}</Typography>
            <Typography variant="body2">ID : {asteroid.id}</Typography>
            <Typography variant="body2">Upcoming Approach : {getNextApproachingDate(asteroid.close_approach_data)} </Typography>

          </Box>
        ))}
      </Box>
      <Modal
        open={modalopen}
        onClose={handlemodalclose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            maxWidth: '90%',
            width: '60%',
            padding: { xs: '16px', sm: '20px', md: '24px' },
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflowY: 'auto',
            maxHeight: '90vh',
          }}
        >
          <Typography variant="h5" color="textPrimary" gutterBottom>
            {selast?.name} <FontAwesomeIcon icon={faMeteor} color="#000" />
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            <FontAwesomeIcon icon={faCalendarAlt} color="#000" /> First Observation Date: {selast?.orbital_data.first_observation_date}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            <FontAwesomeIcon icon={faCalendarAlt} color="#000" /> Last Observation Date: {selast?.orbital_data.last_observation_date}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            <FontAwesomeIcon icon={faAngleUp} color="#000" /> Inclination: {selast?.orbital_data.inclination}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            <FontAwesomeIcon icon={faStar} color="#000" /> Equinox: {selast?.orbital_data.equinox}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            <FontAwesomeIcon icon={faCalendarDay} color="#000" /> Upcoming Approach Date: {selast?.close_approach_data[index].close_approach_date_full}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            <FontAwesomeIcon icon={faBolt} color="#000" /> Upcoming Approach Speed: {Math.round(selast?.close_approach_data[index].relative_velocity.miles_per_hour)} mph
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            <FontAwesomeIcon icon={faRuler} color="#000" /> Upcoming Approach Miss Distance: {Math.round(selast?.close_approach_data[index].miss_distance.miles)} miles
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            <FontAwesomeIcon icon={faFileAlt} color="#000" /> "{selast?.orbital_data.orbit_class.orbit_class_description}"
          </Typography>
        </Box>
      </Modal>




      <Button
        variant="contained"
        onClick={handleopen}
        sx={{
          backgroundColor: 'black', 
          color: "white", 
          display: 'flex',
          alignItems: 'center', 
          gap: 1.5, 
          padding: '8px 16px', 
          position: 'fixed',
          bottom: 16,
          right: 16,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
          borderRadius: '24px', 
          '&:hover': {
            backgroundColor: '#adb5bd', 
            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)', 
          },
        }}
        aria-label="Open Chatbot"
      >
        
        <FontAwesomeIcon icon={faRobot} size="lg" /> 
        <Typography variant="body1" component="span">
          A.I. Assistant
        </Typography>
      </Button>
      <Modal
        open={open}
        onClose={handleclose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        
        <Box
          backgroundColor="white"
          display="flex"
          flexDirection="column"
          width={{ xs: '90%', sm: '80%', md: '60%', lg: '50%' }} // Responsive width
          maxWidth="800px" // Maximum width
          height="80vh" // Responsive height
          maxHeight="80vh" // Maximum height
          borderRadius="16px"
          sx={{
            position: 'relative',
            boxShadow: 24,
            p: 2,
            overflow: 'hidden',
          }}
        >
          <Button
  variant="contained"
  sx={{
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#43464B', // Same color as Send button
    color: '#FFFFFF', // White text color
    '&:hover': {
      backgroundColor: '#333333', // Darker shade for hover
    },
    borderRadius: '10%',
    minWidth: 'auto',
    padding: '0 8px',
    height: 30,
    textAlign: 'center',
  }}
  onClick={handleclose}>
  Close
</Button>
          <Stack
            direction="column"
            spacing={2}
            height="calc(100% - 60px)"  // Adjusted to fit input field better
            overflow="auto"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'user' ? 'flex-end' : 'flex-start'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'user' ? '#696969' : 'black'
                  }
                  color="white"
                  borderRadius="16px"
                  p={2}
                  maxWidth="70%"  // Responsive max width for messages
                >
                  {message.content}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ paddingTop: '8px', width: '100%' }}
          >
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#43464B',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#333333',
                },
              }}
              onClick={sendMessage}
            >
              Send
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>



  )
}

