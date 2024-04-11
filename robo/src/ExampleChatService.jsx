

export class ExampleChatService {
    constructor(storage, update) {
      this.storage = storage;
      this.updateState = update;
  
      this.eventHandlers = {
        onMessage: () => {},
        onConnectionStateChanged: () => {},
        onUserConnected: () => {},
        onUserDisconnected: () => {},
        onUserPresenceChanged: () => {},
        onUserTyping: () => {},
      };
  
      window.addEventListener("chat-protocol", (evt) => {
        const event = evt;
        const { detail: { type }, detail } = event;
  
        if (type === "message") {
          const message = detail.message;
          message.direction = "Incoming";
          const { conversationId } = detail;
  
          if (this.eventHandlers.onMessage && detail.sender !== this) {
            this.eventHandlers.onMessage(
              new MessageEvent({ message, conversationId })
            );
          }
        } else if (type === "typing") {
          const { userId, isTyping, conversationId, content, sender } = detail;
  
          if (this.eventHandlers.onUserTyping && sender !== this) {
            this.eventHandlers.onUserTyping(
              new UserTypingEvent({
                userId,
                isTyping,
                conversationId,
                content,
              })
            );
          }
        }
      });
    }
  
    sendMessage({ message, conversationId }) {
      const messageEvent = new CustomEvent("chat-protocol", {
        detail: {
          type: "message",
          message,
          conversationId,
          sender: this,
        },
      });
  
      window.dispatchEvent(messageEvent);
      return message;
    }
  
    sendTyping({ isTyping, content, conversationId, userId }) {
      const typingEvent = new CustomEvent("chat-protocol", {
        detail: {
          type: "typing",
          isTyping,
          content,
          conversationId,
          userId,
          sender: this,
        },
      });
  
      window.dispatchEvent(typingEvent);
    }
  
    on(evtType, evtHandler) {
      const key = `on${evtType.charAt(0).toUpperCase()}${evtType.slice(1)}`;
  
      if (key in this.eventHandlers) {
        this.eventHandlers[key] = evtHandler;
      }
    }
  
    off(evtType, eventHandler) {
      const key = `on${evtType.charAt(0).toUpperCase()}${evtType.slice(1)}`;
  
      if (key in this.eventHandlers) {
        this.eventHandlers[key] = () => {};
      }
    }
  }
  
  // Event classes
  class MessageEvent {
    constructor({ message, conversationId }) {
      this.message = message;
      this.conversationId = conversationId;
    }
  }
  
  class UserTypingEvent {
    constructor({ userId, isTyping, conversationId, content }) {
      this.userId = userId;
      this.isTyping = isTyping;
      this.conversationId = conversationId;
      this.content = content;
    }
  }
  
  // Exporting event classes if needed
  export { MessageEvent, UserTypingEvent };
  