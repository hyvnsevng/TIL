<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebaseAuth } from 'vuefire'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'

const router = useRouter()

const auth = useFirebaseAuth()

const userInput = ref({
  email: '',
  password: '',
})

const createUser = async () => {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      userInput.value.email,
      userInput.value.password
    )
    router.push('/')
  } catch (error) {
    console.error(error)
  }
}

const signIn = async () => {
  try {
    const credentials = await signInWithEmailAndPassword(
      auth,
      userInput.value.email,
      userInput.value.password
    )
    router.push('/')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <v-container>
    <h1 class="mb-4">로그인 / 회원가입</h1>
    <v-card>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="userInput.email"
            type="email"
            label="이메일"
            required
            placeholder="ssafy@ssafy.com"
          />
          <v-text-field
            v-model="userInput.password"
            label="비밀번호"
            type="password"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="signIn" variant="tonal" color="primary"> 로그인 </v-btn>
        <v-btn @click="createUser" variant="tonal" color="secondary">
          새 사용자 생성
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style></style>
