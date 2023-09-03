import 'primeflex/primeflex.min.css'
import 'primeicons/primeicons.css'
import '@/assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(PrimeVue)
app.use(ToastService)
app.use(router)

app.component('VCard', Card)
app.component('VInputText', InputText)
app.component('VButton', Button)
app.component('VDropdown', Dropdown)
app.component('VInputNumber', InputNumber)
app.component('VAccordion', Accordion)
app.component('VAccordionTab', AccordionTab)
app.component('VDialog', Dialog)
app.component('VToast', Toast)
app.component('VProgressSpinner', ProgressSpinner)

app.mount('#app')
