
import './App.css'
import Header from './components/Header';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Question from './components/Question';
import React, { useState, useEffect } from 'react';
import { UserProvider } from './components/UserContext';
import UserForm from './components/UserForm';
import Results from './components/Results';


function App() {
  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
    },
  ];

  const keywords = {
    Fire: "fire",
    Water: "water",
    Earth: "earth",
    Air: "air",
  };

  const elements = {
    "Red 🔴": "Fire",
    "Blue 🔵": "Water",
    "Green 🟢": "Earth",
    "Yellow 🟡": "Air",
    // Continue mapping all your possible options to a keyword
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState(null);
  const [userName, setUserName] = useState('');
  const [artwork, setArtwork] = useState(null);

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  
  function handleUserFormSubmit(name) {
    setUserName(name);
  };
  
  function determineElement(answers) {
    const counts = {};
    answers.forEach(function(answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce(function(a, b) {
      return counts[a] > counts[b] ? a : b
    });
  };

  useEffect(() => {
    function fetchArtwork(keyword) {
      const apiEndpoint = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`;
      
      fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
          if (data.total > 0) {
            const objectId = data.objectIDs[0]; // Get a random object ID
            fetchArtworkDetails(objectId);
          }
        })
        .catch(error => {
          console.error('Error fetching artwork:', error);
        });
    }

    if (currentQuestionIndex === questions.length) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
    }
  }, [currentQuestionIndex, answers]);

  function fetchArtworkDetails(objectId) {
    const detailsEndpoint = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
    
    fetch(detailsEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Artwork details:', data); // Debugging: Log the artwork details

        setArtwork(data);
      })
      .catch(error => {
        console.error('Error fetching artwork details:', error);
      });
  }



  return (
    <div>
      <UserProvider value={{ name: userName, setName: setUserName }} >
        <Header />
        <Routes>
          <Route path="/" element={<UserForm onSubmit={handleUserFormSubmit} />} />
          <Route
            path="/quiz"
            element={
              currentQuestionIndex < questions.length ? (
                <Question question={questions[currentQuestionIndex].question} options={questions[currentQuestionIndex].options} onAnswer={handleAnswer} />
              ) : (
                <Results element={element} artwork={artwork} />
              )
            }
          />
        </Routes>
      </UserProvider>
    </div>
  )
}

export default App
