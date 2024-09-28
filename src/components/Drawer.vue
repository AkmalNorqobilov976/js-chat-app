<script setup lang="ts">
const props = defineProps({
    drawer: {
        type: Boolean,
        default: false,
        required: true
    },
    chatLists: {
        type: Array<any>,
        default: () => []
    }
});
</script>

<template>
    <div v-if="props.drawer" class="absolute left-0 inset-0 bg-gray-800 bg-opacity-75 z-50">
        <div class="absolute left-0 top-0 w-64 h-full bg-gradient-to-b bg-gray-200 shadow-lg">
            <button @click="$emit('close-drawer')" class="absolute right-2 top-6 rounded-full bg-gray-800 text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="p-4">

                <h1 class="text-xl font-bold">
                    Chat Lists
                </h1>
                <p>
                    Select chat!!!
                </p>
            </div>
            <nav class="mt-4">
                <ul>
                    <li v-for="chatList in chatLists" :key="chatList.id" class="border-b-2 border-gray-600">
                        <a @click="$emit('select-chat-room-id', chatList.id)"
                            class="block cursor-pointer text-gray-800 bg-gray-200 hover:bg-blue-200 py-2 px-4">
                            <h5 class="font-bold">
                                Chat room {{ chatList.id }}
                            </h5>
                            <p v-if="chatList.last_message && chatList.last_message.message">
                                <span>
                                    <i>
                                        {{ chatList.last_message.message }}
                                    </i>
                                </span>
                                <span class="font-semibold">
                                    sent by {{ chatList.last_message.sender_id }}
                                </span>
                            </p>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>
