import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './main.scss';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, Avatar, ConversationHeader } from "@chatscope/chat-ui-kit-react";
import Animation from './three';
import './variables.scss';

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([{ message: "Hello, I'm Robo!", sender: "Robo", direction: "incoming" }]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate loading time
  }, []);

  const handleSend = async (message) => {
    const newMessage = { message, sender: "user", direction: "outgoing" };
    // Update the messages state first to include the new message
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setTyping(true);

    await processMessageToRobo([...messages, newMessage]);
    setTyping(false);
  };
/*   const handleFileInputClick = () => {
    if(fileInputRef.current) {
      fileInputRef.current.click();
    }
  }; */
  
  const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      // Process the file upload here. Depending on your application, you might want to
      // send it to a server or handle it in some way.
    }
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
/*   const fileInput = (
    <>
      <input
        id="file-upload"
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />
      <label htmlFor="file-upload" className="cs-button cs-button--attachment">
        <FontAwesomeIcon icon={faPaperclip} />
        <span>Upload File</span>
      </label>
    </>
  ); */
  return (
    <div className="App">
      <div className="chat-container">
        <h5>Welcome to Robo Chat!</h5>
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
          {/* Label and hidden input for file upload */}
          <label htmlFor="file-upload" className="cs-button cs-button--attachment1">
            <FontAwesomeIcon icon={faPaperclip} />
            <span>Upload File</span>
          </label>
          <input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelected}
            />
        </MainContainer>
        {isLoading && <Animation />}
        <div className="luciano">
          <h5>&copy; 2024 Made with &hearts; by Luciano Lawson</h5>
        </div>
        <footer className="socials">
          <a href="https://github.com/LucianoLawson/robo-ai" className="github-link"><FontAwesomeIcon icon={faGithub} size="2x" /></a>
          <a href="https://www.linkedin.com/in/luciano-lawson/" className="linkedin-link"><FontAwesomeIcon icon={faLinkedin} size="2x" /></a>
          <a href="https://lucianolawson.vercel.app/" className="website-link"><FontAwesomeIcon icon={faCode} size="2x" /></a>
        </footer>
      </div>
    </div>
  );
}

export default App;