<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { collection, addDoc } from "firebase/firestore"; 
import { useFirestore } from 'vuefire'

const router = useRouter();

const newCafe = ref({
  name: '',
  rating: 0,
  location: '서울시 강남구',
  price: 3000,
  favorite: false,
})

const db = useFirestore();

const addCafe = async () => {
  try{
    const docRef = await addDoc(collection(db, "ssafy-cafe"), {...newCafe.value});
    console.log("Document written with ID: ", docRef.id);
    router.push('/');
  }catch{
    console.error("문서를 추가하는 과정에 에러가 발생했습니다...!")
  }
}

</script>

<template>
  <v-container>
    <h1 class="mb-4">새 카페</h1>
    <v-card>
      <v-form>
        <v-text-field
          v-model="newCafe.name"
          label="이름"
          required
          placeholder="카페명"
        />
        <v-text-field
          v-model="newCafe.rating"
          label="평점"
          type="number"
          min="0"
          max="5"
          step="0.5"
          required
        />
        <v-text-field v-model="newCafe.location" label="위치" required />
        <v-text-field
          v-model.number="newCafe.price"
          label="가격"
          type="number"
          min="0"
          max="1000000"
          required
        />
        <v-checkbox v-model="newCafe.favorite" label="즐겨찾기" />
      </v-form>
      <v-card-actions>
        <v-btn @click="addCafe" variant="tonal" color="success">
          새 카페 추가
        </v-btn>
        <v-btn variant="tonal" color="error" outlined> 취소 </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style></style>
