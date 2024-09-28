<template>
  <div id="app" class="grid grid-cols-2 gap-5">

    <Chat user-name="User1" :chat-room-id="2" :owner-id="28" :user-token="user1Token" />
    <Chat user-name="User2" :chat-room-id="2" :owner-id="27" :user-token="user2Token" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chat from './components/Chat.vue';

export default defineComponent({
  components: {
    Chat,
  },
  setup() {
    const user1Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOCwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzI3NDE4NTk3LCJleHAiOjE3NTYyMTg1OTcsImp0aSI6ImNiNDkwMGE4M2I1NjRjNzNiZjhhMzdjMzczYmYxYWExIiwidG9rZW5fdHlwZSI6ImFjY2VzcyJ9.tga8n_ffleEvNolUIFjpoZ7GqwwIPo9f-A0cvQN8sKc';
    const user2Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNywicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzI3NDE4NjI3LCJleHAiOjE3NTYyMTg2MjcsImp0aSI6IjlmZmZiOWNkNDM3ZjQzYmZhMGI5ZGQzYmNlZGUzMTQ1IiwidG9rZW5fdHlwZSI6ImFjY2VzcyJ9.M5JkUJRdxe-U13iv8w266Nex1pgw_68qosqx8nBiSAE';
    
    return {
      user1Token,
      user2Token,
    };
  },
});
</script>
