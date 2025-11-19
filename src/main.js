import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'

const app = createApp(App)

app.directive('tooltip', {
    mounted(el, binding) {
        window.$(el).tooltip({
            title: binding.value,
            triger: 'focus',
            html: true
        })
    }
})

app.directive('popover', {
    mounted(el, binding) {
        window.$(el).tooltip({
            title: binding.value,
            placement: binding.arg,
            trigger: 'manual click',
            html: true
        })
    }
})

app.use(router)
// app.use(store)
app.mount('#app')