import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import './main.scss';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, Avatar, ConversationHeader } from "@chatscope/chat-ui-kit-react";
import ThreeText from './loader';
import useVantaEffect from './vantaEffect'; // Import the Vanta.js effect

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([{ message: "Hello, I'm Robo!", sender: "Robo", direction: "incoming" }]);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  
  // Call the useVantaEffect hook to get the reference
  const mountRef = useVantaEffect();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Set loading state to false after 3 seconds
    }, 3000);
  }, []);

  const handleSend = async (message) => {
    const newMessage = { message, sender: "user", direction: "outgoing" };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setTyping(true);
    await processMessageToRobo([...messages, newMessage]);
    setTyping(false);
  };

  async function processMessageToRobo(chatMessages) {
    let apiMessages = chatMessages.map(messageObject => ({
      role: messageObject.sender === "Robo" ? "assistant" : "user",
      content: messageObject.message
    }));

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I'm a mid-level developer."
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages]
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody)
    }).then(response => response.json()).then(data => {
      setMessages(prevMessages => [...prevMessages, {
        message: data.choices[0].message.content,
        sender: "Robo",
        direction: "incoming"
      }]);
    });
  }

  return (
    <div className="App" ref={mountRef}>
      {isLoading && (
        <div className="loading-screen">
          <ThreeText />
        </div>
      )}
      {!isLoading && ( // Render the app content when isLoading is false
        <div className="chat-container">
          <MainContainer>
            <ChatContainer>
              <ConversationHeader>
                <Avatar name="Robo" size="md" src="/robo-icon.svg" status="available" />
              </ConversationHeader>
              <MessageList typingIndicator={typing ? <TypingIndicator content="Robo is typing" /> : null}>
                {messages.map((message, index) => (
                  <Message key={index} model={message} />
                ))}
              </MessageList>
              <MessageInput placeholder="Type message here" onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
          <div className="luciano">
            <h5>&copy; 2024 Made with &hearts; by Luciano Lawson</h5>
          </div>
          <footer className="socials">
            <a href="https://github.com/LucianoLawson/robo-ai" className="github-link"><FontAwesomeIcon icon={faGithub} size="2x" /></a>
            <a href="https://www.linkedin.com/in/luciano-lawson/" className="linkedin-link"><FontAwesomeIcon icon={faLinkedin} size="2x" /></a>
            <a href="https://lucianolawson.vercel.app/" className="website-link"><FontAwesomeIcon icon={faCode} size="2x" /></a>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
