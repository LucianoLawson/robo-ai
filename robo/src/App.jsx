import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am Robo!",
      sender: "Robo",
      direction: "incoming"
    }
  ]) // []

const handleSend = async (message) => {
  const newMessage = {
    message,
    sender: "user",
    direction: "outgoing"
  }

  const newMessages = [...messages, newMessage]; //old messages plus new messages
  
  //update message state
  setMessages(newMessages);

  setTyping(true);
  //process message to chatGPT
  await processMessagetoRobo(newMessages); 
}

async function processMessagetoRobo(chatMessages) {
  // chatMessages { sender: "user" or "Robo", message: "The message content here"}
  // apiMessages { role: "user" or "assistant", content: "The message content here"}
  let apiMessages = chatMessages.map((messageObject) => {
    let role = "";
    if(messageObject.sender === "Robo") {
      role = "assistant";
    } else {
      role = "user"
    }
     return { role: role, content: messageObject.message }
  });

//role: "user" -> message from user, "assistant" -> response from robot
//"system" -> one initial message defining how we want robo to talk
const systemMessage = {
  role: "system",
  content: "Explain all concepts like I am a mid-level developer."
}

  const apiRequestBody = {
    "model": "gpt-3.5-turbo",
    "messages": [
      systemMessage,
      ...apiMessages // [message1, message2,message3]
    ]
  }

  await fetch("https://api.openai.com/v1/chat/completions",{
    method: "POST",
    headers: {
      "Authorization": "Bearer " + API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiRequestBody)
  }).then((data) => {
    return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "Robo",
          direction: "incoming"
        }]
      )
    });
    setTyping(false);
}

  return (
      <div className="App">
        <div style={{ position: "relative", height: "800px", width: "700px"}}>
          <MainContainer>
            <ChatContainer>
              <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="Robo is typing" /> :null}
              >
                {messages.map((message, i) => {
                  return <Message key={i} model={message} />
                })}
              </MessageList>
              <MessageInput placeholder='Type message here' onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
        <footer className="socials">
            <div className="icon-container" data-title="Visit my GitHub">
                <a href="https://github.com/LucianoLawson/robo-ai" target="_blank" rel="noopener noreferrer" className="github-link">
                    <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
            </div>
            <div className="icon-container" data-title="Visit my LinkedIn">
                <a href="https://www.linkedin.com/in/luciano-lawson/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                </a>
            </div>
            <div className="icon-container" data-title="Visit my Portfolio">
                <a href="https://lucianolawson.vercel.app/" target="_blank" rel="noopener noreferrer" className="website-link">
                    <FontAwesomeIcon icon={faCode} size="2x" />
                </a>
            </div>
        </footer>
    </div>
  )
}

export default App
