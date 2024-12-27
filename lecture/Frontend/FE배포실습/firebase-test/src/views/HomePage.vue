<script setup>
import { ref, computed } from 'vue'
import { useFirestore } from 'vuefire'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import CafeCard from '@/components/CafeCard.vue'

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useCollection } from "vuefire";

const db = useFirestore();
const cafeCollection = useCollection(collection(db, "ssafy-cafe"));


// const cafeCollection = ref([]);
// const q = query(collection(db, "ssafy-cafe"));
// const unsubscribe = onSnapshot(q, (querySnapshot) => {
//   cafeCollection.value = [];
//   querySnapshot.forEach((doc) => {
//     cafeCollection.value.push(doc.data());
//   });
// });


// const q = query(collection(db, "ssafy-cafe"));
// const querySnapshot = await getDocs(q);
// querySnapshot.forEach((doc) => {
//   console.log(doc.id, " => ", doc.data());
//   cafeCollection.value.push(doc.data());
// });

const filterParams = ref({
  text: '',
  favorite: false,
});

const filteredCafes = computed(() => {
  return cafeCollection.value.filter((cafe) => {
    return (
      cafe.name.toLowerCase().includes(filterParams.value.text.toLowerCase()) &&
      (filterParams.value.favorite ? cafe.favorite : true)
    )
  })
})
</script>

<template>
  <SidebarLayout>
    <template v-slot:sidebar>
      <v-container>
        <h2 class="mb-4">필터</h2>
        <v-form>
          <v-text-field v-model="filterParams.text" label="가게명" />
          <v-checkbox v-model="filterParams.favorite" label="즐겨찾기유무" />
        </v-form>
      </v-container>
    </template>

    <template v-slot:main>
      <v-container>
        <h2 class="mb-4">목록</h2>
        <CafeCard
          v-for="cafe in filteredCafes"
          v-bind:cafe="cafe"
          :docId="cafe.id"
          :key="cafe.id"
        />
      </v-container>
    </template>
  </SidebarLayout>
</template>

<style></style>
