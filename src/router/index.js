import { createWebHistory, createRouter } from "vue-router";

import Hello from '@/components/HelloWorld.vue'
import Main from '@/view/Main.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Main',
            component: Main
        },
        {
            path: '/hello',
            name: 'Hello',
            component: Hello
        },
    ]
})