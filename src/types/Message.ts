import { SocketActions } from "@/utils/constants";

export interface ReplyMessage {
  id: number;
  message_unique_id: number;
  message: string;
  sender_id: number;
}

export interface Message {
  action: SocketActions;
  payload: {
    chat_room_id: number;
    message: string;
    reply_message: ReplyMessage | null;
  };
  query: {
    // Optional pagination properties if needed
    page?: number;
    page_size?: number;
  };
}

// export GetPrivateChatList