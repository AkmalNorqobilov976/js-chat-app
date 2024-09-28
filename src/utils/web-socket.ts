import { Message } from "postcss";
import { SocketActions } from "./constants";

export  class WebSocketClient {
    private url: string = "ws://5.182.26.58:4321/ws/web";
    private token: string;
    private ws: WebSocket | null;
    private onMessageCallback: ((data: Message) => void) | null;
    private onErrorCallback: ((error: Event) => void) | null;
    private onCloseCallback: (() => void) | null;
  
    constructor(token: string) {
        this.token = token;
        this.url = `${this.url}?token=${this.token}`;
      this.ws = null;
      this.onMessageCallback = null;
      this.onErrorCallback = null;
      this.onCloseCallback = null;
    }
  
    // Initialize WebSocket connection
    public connect(): void {

      this.ws = new WebSocket(`${this.url}`);
        this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.authenticate();
      };
  
      this.ws.onmessage = (event: MessageEvent) => {
        const data: Message = JSON.parse(event.data);
        console.log('Message from server:', data);
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
      };
  
      this.ws.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
      };
  
      this.ws.onclose = (res) => {
        console.log(res);
        console.log('WebSocket connection closed');
        if (this.onCloseCallback) {
          this.onCloseCallback();
        }
      };
    }
  
    // Authenticate using the user token
    private authenticate(): void {
      const authMessage: Partial<Message> = {
      action: SocketActions.GET_PRIVATE_CHAT_LIST,
    };

    this.ws?.send(JSON.stringify(authMessage));

    this.ws?.send(JSON.stringify({
      action: 'docs'
    }))
    }
  
    // Send a message
    public sendMessage(chatMessage: any): void {
      console.log(chatMessage)
      try {
        this.ws?.send(JSON.stringify(chatMessage));
      } catch (error) {
        console.log(error)
      }
    }
  
    // Set callback for message reception
    public onMessage(callback: (data: Message) => void): void {
      this.onMessageCallback = callback;
    }
  
    // Set callback for errors
    public onError(callback: (error: Event) => void): void {
      this.onErrorCallback = callback;
    }
  
    // Set callback for connection closure
    public onClose(callback: () => void): void {
      this.onCloseCallback = callback;
    }
    
    public getPrivateChatList() {
      this.ws?.send(JSON.stringify({
        action: SocketActions.GET_PRIVATE_CHAT_LIST
      })
      );
    } 

    public getPrivateChats() {
      this.ws?.send(JSON.stringify({
        action: SocketActions.GET_PRIVATE_CHAT_LIST
      }))
    } 

    public getPrivateChatMessages(chatRoomId: Number) {
      this.ws?.send(JSON.stringify({
        action: SocketActions.GET_PRIVATE_CHAT_MESSAGE,
        query: {
          chat_room_id: +chatRoomId
        }
      }))
    }
  }
  