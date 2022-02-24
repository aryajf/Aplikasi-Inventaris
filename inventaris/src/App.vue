<template>
    <div id="app">
        <!-- CONFIRM MODAL -->
        <ConfirmDialog :breakpoints="{'960px': '40vw', '640px': '100vw'}" :style="{width: '40vw'}"></ConfirmDialog>

        <!-- SESSION EXPIRED MODAL -->
        <div class="modal fade" ref="tokenExpiredModal" id="tokenExpiredModal" tabindex="-1" aria-labelledby="tokenExpiredModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tokenExpiredModalLabel"><i class="uil uil-bell me-2"></i>Pemberitahuan</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Session anda telah berakhir, harap login kembali untuk melanjutkan
                    </div>
                    <div class="modal-footer">
                        <a @click="toLogin" data-bs-dismiss="modal" class="btn btn-sm btn-primary">Login</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- DASHBOARD MENU -->
        <div v-if="this.$route.name != 'not-found'">
            <div v-if="authenticated">
                <Dashboard/>
            </div>
            <router-view v-else></router-view>
        </div>
        <router-view v-else></router-view>

        <!-- PROGRESS BAR -->
        <vue-progress-bar></vue-progress-bar>

    </div>
</template>
<script>
import { mapGetters } from "vuex"
import appConfig from "@/config/app"
import Dashboard from '@/components/layouts/Dashboard.vue'
import { Modal } from "bootstrap"
export default {
    setup() {
        return {
            homeURL: appConfig.homeURL,
        }
    },
    watch: {
        $route() {
            this.checkToken()
        },
    },
    computed: {
        ...mapGetters({
            user: "auth/user",
            authenticated: "auth/authenticated",
        }),
    },
    components: { Dashboard },
    mounted() {
        this.$Progress.finish()
    },
    created() {
        this.$Progress.start()

        this.$router.beforeEach((to, from, next) => {
            if (to.meta.progress !== undefined) {
                let meta = to.meta.progress
                this.$Progress.parseMeta(meta)
            }
            this.$Progress.start()
            next()
        })

        this.$router.afterEach((to, from) => {
            this.$Progress.finish()
        })
    },
    methods: {
        checkToken() {
            if (this.authenticated) {
                let now = new Date()
                let expired = new Date(this.user.token_expired_at) - now
                if (expired < 0) {
                    var myModal = new Modal(this.$refs.tokenExpiredModal)
                    myModal.show()
                    this.$store.dispatch("auth/logout")
                }
            }
        },
        toLogin() {
            window.location.href = this.homeURL + "/login"
        },
    },
}
</script>