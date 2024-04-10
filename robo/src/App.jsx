import { useState } from 'react';
/* import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg' */
import './App.css'
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
        </div>
  )
}

export default App
