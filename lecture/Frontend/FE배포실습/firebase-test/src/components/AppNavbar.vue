<script setup>
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { signOut } from 'firebase/auth'

const user = useCurrentUser()
const auth = useFirebaseAuth()

const signOutofFirebase = async () => {
  try {
    await signOut(auth)
    console.log('로그아웃이 성공했습니다...!')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <v-app-bar color="teal">
    <v-app-bar-title>SSAFY Cafes</v-app-bar-title>
    <v-spacer></v-spacer>
    <nav class="pr-4">
      <v-btn to="/">Home</v-btn>
      <v-btn to="/new">NEW</v-btn>
      <v-btn v-if="user?.email" @click="signOutofFirebase">LOGOUT</v-btn>
      <v-btn v-else to="/signin">SIGN IN</v-btn>
    </nav>
  </v-app-bar>
</template>

<style></style>
