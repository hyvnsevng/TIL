import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
})

app.mount('#app')
