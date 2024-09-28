<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from 'vue';
import { WebSocketClient, Message } from '@/utils/web-socket.ts';
import { SocketActions } from '@/utils/constants.ts';
import Drawer from './Drawer.vue';
import { formatter } from '../composable/date-formatter';

export default defineComponent({
    props: {
        chatRoomId: {
            type: Number,
            required: true,
        },
        userName: {
            type: String,
            required: true
        },
        userToken: {
            type: String,
            required: true,
        },
        ownerId: {
            type: Number,
            required: true
        }
    },

    components: {
        Drawer
    },
    setup(props) {
        const newMessage = ref('');
        const chatRoomId: Ref<Number | null> = ref();
        const chatContainer: Ref = ref(null);
        const currentUserSocket: Ref<WebSocketClient> = ref(new WebSocketClient(props.userToken));
        const chatListToggler = ref(false);
        const chatLists = ref([]);
        const currentUsers = ref({
            name: props.userName,
            member_id: 1,
            is_online: false
        });
        const showCloseMessages = ref({
            show: false,
            errorMessage: ""
        });

        const messages = ref<Message[]>([
        ]);

        const onMessage = (data: Message) => {
            if (data.action == SocketActions.SEND_ONLINE_USERS) {
                currentUsers.value.member_id = data.data.member_id;
                currentUsers.value.is_online = data.data.is_online;
            } else if (data.action == SocketActions.SEND_MESSAGE_TO_CHAT) {
                messages.value.push(data.data);
            } else if (data.action == SocketActions.GET_PRIVATE_CHAT_LIST) {
                chatLists.value = data.results;
            }
            // else if (data.action = SocketActions.GET_PRIVATE_CHAT_MESSAGE && Array.isArray(data.results)) {
            //     messages.value = [...messages.value, ...data.results]
            // }
        }

        const onClosed = () => {
            showCloseMessages.value.show = true;
            showCloseMessages.value.errorMessage = "Something went wrong!"
            setTimeout(() => {
                showCloseMessages.value.show = false;
                showCloseMessages.value.errorMessage = ""
            }, 3000)
        }

        const onError = (error: Event) => {
            alert("error occured")
        }

        const onChatListToggler = () => {
            chatListToggler.value = !chatListToggler.value;
        }

        watch(chatRoomId, (newValue) => {
            if (!newValue) {
                chatListToggler.value = true;
            } else {
                currentUserSocket.value.getPrivateChatMessages(newValue);
            }
        }, {
            immediate: true
        });

        watch(messages, () => {
            if (chatContainer.value) {
                chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            }
        });
        onMounted(() => {

            currentUserSocket.value.connect();
            currentUserSocket.value.onMessage(onMessage);
            currentUserSocket.value.onClose(onClosed);
            currentUserSocket.value.onError(onError);
            currentUserSocket.value.onError(onError);
            // currentUserSocket.value.getPrivateChats();
        });

        const sendMessage = () => {
            if (newMessage.value.trim() === '') return;

            const message: Message = {
                action: SocketActions.SEND_MESSAGE_TO_CHAT,
                payload: {
                    chat_room_id: chatRoomId.value,
                    message: newMessage.value,
                    reply_message: null,
                },
                query: {}
            };

            currentUserSocket.value.sendMessage(message)

            newMessage.value = '';
        };

        const setChatRoomId = (id: Number): void => {
            chatRoomId.value = id;
            onChatListToggler();
            newMessage.value = "";
            messages.value = [];
        }

        return {
            messages,
            newMessage,
            sendMessage,
            currentUsers,
            showCloseMessages,
            chatListToggler,
            onChatListToggler,
            chatLists,
            formatter,
            setChatRoomId,
            chatRoomId,
            chatContainer
        };
    },
});
</script>
<template>
    <div class="relative h-screen bg-center bg-cover overflow-hidden">
        <header class="bg-gray-800 text-white shadow-md">
            <div class="container mx-auto flex justify-between items-center p-4">
                <div class="flex items-center">
                    <img src="https://via.placeholder.com/40" alt="User Avatar" class="h-10 rounded-full mr-3" />
                    <div>
                        <h1 class="text-xl font-bold">Chat Room {{ chatRoomId }}</h1>
                        <p class="text-sm text-gray-300">
                            {{ currentUsers.is_online ? "Active users available" : "Active users unavailable" }}
                        </p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <button @click="onChatListToggler" class="hover:text-gray-400 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    
                </div>
            </div>
        </header>
        <Drawer :drawer="chatListToggler" @select-chat-room-id="setChatRoomId($event)" :chat-lists="chatLists"
            @close-drawer="onChatListToggler" />
        <Transition name="fade">
            <div v-if="showCloseMessages.show"
                class="absolute top-0 left-0 right-0 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert">
                <span class="font-medium">Danger alert!</span> {{ showCloseMessages.errorMessage }}
            </div>
        </Transition>

        <img class="w-full h-screen absolute left-0 right-0 bottom-0 top-0 object-cover -z-10"
            src="./../assets/images/wallpaper.png" alt="">
        <template v-if="!chatListToggler">


            <div class="messages overflow-y-auto h-screen absolute right-0 left-0 pb-6">
                <div v-for="msg in messages" :key="msg.message_unique_id" class="flex flex-col p-4 space-y-4">
                    <div v-if="ownerId == msg.sender_id" class="chat-message sent">
                        <div class="flex items-start mb-2">
                            <img src="https://via.placeholder.com/40" alt="User Avatar"
                                class="w-10 h-10 rounded-full mr-2" />
                            <div class="flex flex-col">
                                <span class="font-semibold text-gray-800">{{ msg.sender_name }}</span>
                                <div class="bg-blue-500 text-white p-3 rounded-lg max-w-xs rounded-br-none">
                                    <p>{{ msg.message }}</p>
                                </div>
                                <span class="text-xs text-gray-500 mt-1">{{ formatter(msg.created_date) }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-else class="chat-message received">
                        <div class="flex items-start mb-2 gap-2 justify-end">
                            <div class="flex flex-col justify-end">
                                <span class="font-semibold text-gray-800">{{ msg.sender_name }}</span>
                                <div class="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs rounded-bl-none">
                                    <p>{{ msg.message }}</p>
                                </div>
                                <span class="text-xs font-bold text-right text-gray-500 mt-1">{{
                                    formatter(msg.created_date) }}</span>
                            </div>
                            <img src="https://via.placeholder.com/40" alt="User Avatar"
                                class="w-10 h-10 rounded-full mr-2" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute bottom-0 right-0 left-0">
                <input class=" h-14 outline-none px-3 w-full border-blue-500 border-2 rounded-lg"
                    v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
                <button @click="sendMessage" 
                    class="flex items-center justify-center p-2 absolute z-20 right-0 bottom-0 h-14 w-14 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12h18M12 3l9 9-9 9" />
                    </svg>
                </button>
            </div>
        </template>
    </div>
</template>
