import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import appConfig from "./config/app"

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
    onRegistered(r) {
        r && setInterval(() => {
            r.update()
        }, 60 * 60 * 1000 /* 1 hour: timeout in milliseconds */)
    },
    onNeedRefresh() {
        // show a prompt to user
    },
    onOfflineReady() {
        // show a ready to work offline to user
    },
})
updateSW()

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

// Primevue
import PrimeVue from 'primevue/config'

import "primevue/resources/themes/saga-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"
import Button from 'primevue/button';
import Chart from 'primevue/chart'
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import RadioButton from 'primevue/radiobutton'
import ProgressBar from 'primevue/progressbar'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message'
import Paginator from 'primevue/paginator'
import Skeleton from 'primevue/skeleton'

// Axios
import axios from 'axios'
axios.defaults.baseURL = appConfig.apiURL

// Progressbar Loading
import VueProgressBar from "@aacassandra/vue3-progressbar"
const options = {
    color: "#8463FF",
    failedColor: "#EC615B",
    thickness: "5px",
    transition: {
        speed: "0.2s",
        opacity: "0.6s",
        termination: 300,
    },
    autoRevert: true,
    location: "top",
    inverse: false,
}

// Vue Cropper
import 'cropperjs/dist/cropper.css'

// Notyf
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
window.notyf = new Notyf({duration: 4000})

import Mixins from "@/mixins"
import '@/store/subscriber'

store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
    createApp(App).use(store).use(router).use(PrimeVue).mixin(Mixins).use(VueProgressBar, options).use(ConfirmationService).component('Button',Button).component('Chart',Chart).component("Dialog", Dialog).component("Dropdown", Dropdown).component("ConfirmDialog", ConfirmDialog).component("InputNumber", InputNumber).component("InputText", InputText).component("ProgressBar", ProgressBar).component("RadioButton", RadioButton).component("Message", Message).component("Paginator", Paginator).component("Skeleton", Skeleton).mount('#app')
})