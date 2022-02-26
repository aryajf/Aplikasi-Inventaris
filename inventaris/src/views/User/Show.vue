<template>
    <div v-if="user">
        <!-- SHOW PROFILE -->
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body" v-if="user != null">
                <h1 class="admin-body-heading"><i class="uil uil-user me-1"></i>User Profile</h1>
                <div class="row">
                    <div class="col-xl-4 col-12">
                        <div class="col-md-12 user-info-left rounded shadow-sm">
                            <div class="avatar">
                                <template v-if="user.avatar == null">
                                    <img src="@/assets/images/no-avatar.png" class="rounded-circle shadow-sm" :alt="user.nama.split(' ').slice(0,2).join(' ')">
                                </template>
                                <template v-else>
                                    <img v-if="user.auth_type == 'Local'" :src="`${apiURL}images/avatar/${user.avatar}`" :alt="user.nama.split(' ').slice(0,2).join(' ')" class="rounded-circle shadow-sm">
                                    <img v-else :src="user.avatar" :alt="user.nama.split(' ').slice(0,2).join(' ')" class="rounded-circle shadow-sm">
                                </template>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-7 offset-xl-1 col-12">
                        <div class="profile-menu">
                            <button class="active" id="btn-biodata" @click="changePage('biodata')">
                                <i class="uil uil-user-circle me-1"></i>Biodata User
                            </button>
                        </div>

                        <template v-if="page == 'biodata'">
                            <p class="profile-item">
                                <span><i class="uil uil-at me-1"></i>Alamat Email</span>
                                <br>
                                {{ user.email }} <br>
                            </p>

                            <p class=" profile-item">
                                <span><i class="uil uil-user-md me-1"></i>Nama Lengkap</span> <br>
                                {{ user.nama }}
                            </p>

                            <p class="profile-item">
                                <span><i class="uil uil-phone-alt me-1"></i>No. Telp</span> <br>
                                <template v-if="user.no_telp != null">{{ user.no_telp }}</template>
                                <template v-else><span class="text-secondary fw-normal">Belum ditambahkan</span></template>
                            </p>

                            <p class="profile-item">
                                <span><i class="uil uil-calendar-alt me-1"></i>Terdaftar pada</span> <br>
                                {{DateFormat(user.createdAt)}}
                            </p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from '@/config/app'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import Pulse from '@/components/loader/Pulse.vue'
import Mixins from '@/mixins'
export default {
    mixins: [Mixins],
    data() {
        return {
            apiURL: config.apiURL,
            page: 'biodata',
        }
    },
    components: { AdminHeader, Pulse },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            formErrors: 'formErrors',
            user: 'user/user',
        }),
    },
    created() {
        this.$store.dispatch('user/showUser', this.$route.params.id)
    },
    methods: {
        changePage(e) {
            let btnBiodata = document.getElementById('btn-biodata')

            if (e == 'biodata') {
                this.page = 'biodata'
                btnBiodata.classList.add('active')
            }
        }
    },
}
</script>

<style lang="scss">
@import '@/assets/sass/app.scss';
@import '@/assets/sass/profileUser.scss';
</style>