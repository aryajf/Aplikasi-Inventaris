<template>
    <div>
        <!-- LOGOUT MODAL -->
        <LogoutModal />

        <!-- DASHBOARD -->
        <div class="dashboard-wrapper">
            <div class="row">
                <div class="dashboard-left-desktop align-items-center sticky-top">
                    <div class="col-md-12 dashboard-left-desktop-content bg-purple shadow">
                        <div class="logo mb-4">
                            <router-link to="/">INVENTARIS PSIKOLOGI</router-link>
                        </div>
                        <div class="user mb-2">
                            <div class="row">
                                <div class="col-md-3">
                                    <img v-if="user.avatar" :src="apiURL+'images/avatars/'+user.avatar" :alt="authenticated.nama" class="w-100 rounded-circle">
                                    <img v-else src="@/assets/images/no-avatar.png" :alt="authenticated.nama" class="w-100 rounded-circle">
                                </div>
                                <div class="col-md-9 p-0 d-flex align-items-center">
                                    <div>
                                        <p class="p-0 m-0">{{ authenticated.nama }}</p>
                                        <span class="badge bg-white text-dark"><span v-if="authenticated.role != 'Admin'">Asisten Lab </span>{{ authenticated.role }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="nav-wrapper">
                            <ul class="nav nav-pills" id="menu">
                                <p class="nav-heading">MAIN</p>
                                <li class="nav-item">
                                    <router-link to="/" class="nav-link">
                                        <i class="uil uil-estate me-2"></i> Home
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/profile" class="nav-link">
                                        <i class="uil uil-user-md me-2"></i> Profile
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <a href="#" class="nav-link" data-bs-toggle="modal" data-bs-target="#signoutModal">
                                        <i class="uil uil-sign-out-alt me-2"></i> Logout
                                    </a>
                                </li>
                                <p class="nav-heading">LAB MENU</p>
                                <li class="nav-item">
                                    <router-link to="/lab" class="nav-link">
                                        <i class="uil uil-edit me-2"></i> Barang
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/history" class="nav-link">
                                        <i class="uil uil-clock me-2"></i> History
                                    </router-link>
                                </li>

                                <p class="nav-heading">APPS</p>
                                <li class="nav-item" v-if="user.role === 'Dasar' || user.role === 'Menengah' || user.role === 'Lanjut'">
                                    <router-link to="/category" class="nav-link">
                                        <i class="uil uil-tag-alt me-2"></i> Category
                                    </router-link>
                                </li>
                                <li class="nav-item" v-if="user.role === 'Admin'">
                                    <router-link to="/user" class="nav-link">
                                        <i class="uil uil-users-alt me-2"></i> Users
                                    </router-link>
                                </li>
                                <template v-if="user.role == 'Dasar' || user.role === 'Menengah' || user.role === 'Lanjut'">
                                    <p class="nav-heading">ITEMS</p>
                                    <template v-if="barang.length !== 0">
                                        <li v-for="item of barang.barang" :key="item.id" class="nav-item">
                                            <router-link :to="'/barang/'+item.id" class="nav-link">
                                                <i class="uil uil-box me-2"></i> {{ item.title }}
                                            </router-link>
                                        </li>
                                    </template>
                                    <li class="nav-item" v-if="user.role === 'Dasar' || user.role === 'Menengah' || user.role === 'Lanjut'">
                                        <router-link to="/barang/create" class="nav-link">
                                            <i class="uil uil-plus me-2"></i> Tambah Item
                                        </router-link>
                                    </li>
                                </template>
                                <template v-else-if="user.role == 'Admin'">
                                    <template v-if="barangDasar.length !== 0">
                                        <p class="nav-heading">Lab Dasar</p>
                                        <li v-for="item of barangDasar" :key="item.id" class="nav-item">
                                            <router-link :to="'/barang/'+item.id" class="nav-link">
                                                <i class="uil uil-box me-2"></i> {{ item.title }}
                                            </router-link>
                                        </li>
                                    </template>
                                    <template v-if="barangMenengah.length !== 0">
                                        <p class="nav-heading">Lab Menengah</p>
                                        <li v-for="item of barangMenengah" :key="item.id" class="nav-item">
                                            <router-link :to="'/barang/'+item.id" class="nav-link">
                                                <i class="uil uil-box me-2"></i> {{ item.title }}
                                            </router-link>
                                        </li>
                                    </template>
                                    <template v-if="barangLanjut.length !== 0">
                                        <p class="nav-heading">Lab Lanjut</p>
                                        <li v-for="item of barangLanjut" :key="item.id" class="nav-item">
                                            <router-link :to="'/barang/'+item.id" class="nav-link">
                                                <i class="uil uil-box me-2"></i> {{ item.title }}
                                            </router-link>
                                        </li>
                                    </template>
                                </template>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="dashboard-left-mobile">
                    <!-- MENU CANVAS -->
                    <div style="z-index: 999;">
                        <div class="offcanvas offcanvas-start bg-purple" tabindex="-1" id="offcanvasWithBackdrop" aria-labelledby="offcanvasWithBackdropLabel">
                            <div class="offcanvas-header">
                                <div class="company-info">
                                    <div class="row">
                                        <div class="canvas-logo col-10">
                                            <a href="https://pojoklaku.com">INVENTARIS PSIKOLOGI</a>
                                        </div>
                                        <div class="canvas-cross col-2 d-flex justify-content-end align-content-center">
                                            <span type="button" data-bs-dismiss="offcanvas" aria-label="Close"><i class="uil uil-times"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="offcanvas-body">
                                <div class="user-info">
                                    <div class="row">
                                        <template v-if="user.length != 0">
                                            <div class="col-3 d-flex align-items-center">
                                                <div v-if="user.avatar">
                                                    <img :src="`${apiURL}images/avatar/${user.avatar}`" :alt="user.avatar" class="w-100 rounded-circle">
                                                </div>
                                                <div v-else>
                                                    <img src="@/assets/images/no-avatar.png" :alt="authenticated.nama" class="w-100 rounded-circle">
                                                </div>
                                            </div>
                                            <div class="col-9 p-0 d-flex align-items-center">
                                                <div>
                                                    <p class="p-0 m-0">{{ authenticated.nama }}</p>
                                                    <span class="badge bg-white text-dark"><span v-if="authenticated.role != 'Admin'">Asisten Lab </span>{{ authenticated.role }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                

                                <div class="canvas-menu mt-2">
                                    <div class="nav-wrapper">
                                        <nav class="nav">
                                            <ul class="nav nav-pills w-100" id="menu">
                                                <p class="nav-heading">MAIN</p>
                                                <li class="nav-item">
                                                    <router-link to="/" class="nav-link">
                                                        <i class="uil uil-estate me-2"></i> Home
                                                    </router-link>
                                                </li>
                                                <li class="nav-item">
                                                    <router-link to="/profile" class="nav-link">
                                                        <i class="uil uil-user-md me-2"></i> Profile
                                                    </router-link>
                                                </li>
                                                <li class="nav-item">
                                                    <a href="#" class="nav-link" data-bs-toggle="modal" data-bs-target="#signoutModal">
                                                        <i class="uil uil-sign-out-alt me-2"></i> Logout
                                                    </a>
                                                </li>
                                                <p class="nav-heading">LAB MENU</p>
                                                <li class="nav-item">
                                                    <router-link to="/lab" class="nav-link">
                                                        <i class="uil uil-edit me-2"></i> Barang
                                                    </router-link>
                                                </li>
                                                <li class="nav-item">
                                                    <router-link to="/history" class="nav-link">
                                                        <i class="uil uil-clock me-2"></i> History
                                                    </router-link>
                                                </li>
                                                <p class="nav-heading">APPS</p>
                                                <li class="nav-item" v-if="user.role === 'Dasar' || user.role === 'Menengah' || user.role === 'Lanjut'">
                                                    <router-link to="/category" class="nav-link">
                                                        <i class="uil uil-tag-alt me-2"></i> Category
                                                    </router-link>
                                                </li>
                                                <li class="nav-item">
                                                    <router-link to="/user" class="nav-link">
                                                        <i class="uil uil-users-alt me-2"></i> Users
                                                    </router-link>
                                                </li>

                                                <template v-if="user.role == 'Dasar' || user.role === 'Menengah' || user.role === 'Lanjut'">
                                                    <p class="nav-heading">ITEMS</p>
                                                    <template v-if="barang.length !== 0">
                                                        <li v-for="item of barang.barang" :key="item.id" class="nav-item">
                                                            <router-link :to="'/barang/'+item.id" class="nav-link">
                                                                <i class="uil uil-box me-2"></i> {{ item.title }}
                                                            </router-link>
                                                        </li>
                                                    </template>
                                                    <li class="nav-item" v-if="user.role === 'Dasar' || user.role === 'Menengah' || user.role === 'Lanjut'">
                                                        <router-link to="/barang/create" class="nav-link">
                                                            <i class="uil uil-plus me-2"></i> Tambah Item
                                                        </router-link>
                                                    </li>
                                                </template>
                                                <template v-else-if="user.role == 'Admin'">
                                                    <template v-if="barangDasar.length !== 0">
                                                        <p class="nav-heading">Lab Dasar</p>
                                                        <li v-for="item of barangDasar" :key="item.id" class="nav-item">
                                                            <router-link :to="'/barang/'+item.id" class="nav-link">
                                                                <i class="uil uil-box me-2"></i> {{ item.title }}
                                                            </router-link>
                                                        </li>
                                                    </template>
                                                    <template v-if="barangMenengah.length !== 0">
                                                        <p class="nav-heading">Lab Menengah</p>
                                                        <li v-for="item of barangMenengah" :key="item.id" class="nav-item">
                                                            <router-link :to="'/barang/'+item.id" class="nav-link">
                                                                <i class="uil uil-box me-2"></i> {{ item.title }}
                                                            </router-link>
                                                        </li>
                                                    </template>
                                                    <template v-if="barangLanjut.length !== 0">
                                                        <p class="nav-heading">Lab Lanjut</p>
                                                        <li v-for="item of barangLanjut" :key="item.id" class="nav-item">
                                                            <router-link :to="'/barang/'+item.id" class="nav-link">
                                                                <i class="uil uil-box me-2"></i> {{ item.title }}
                                                            </router-link>
                                                        </li>
                                                    </template>
                                                </template>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- MOBILE MENU BOTTOM -->
                    <div class="menu">
                        <ul>
                            <li>
                                <router-link to="/">
                                    <span class="icon"><i class="uil uil-estate"></i></span>
                                    <span class="title">Home</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/category">
                                    <span class="icon"><i class="uil uil-tag-alt"></i></span>
                                    <span class="title">Category</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/user">
                                    <span class="icon"><i class="uil uil-user"></i></span>
                                    <span class="title">Users</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="#" data-bs-toggle="modal" data-bs-target="#signoutModal">
                                    <span class="icon"><i class="uil uil-sign-out-alt"></i></span>
                                    <span class="title">Logout</span>
                                </router-link>
                            </li>
                            <li>
                                <a href="" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBackdrop" aria-controls="offcanvasWithBackdrop">
                                    <span class="icon"><i class="uil uil-ellipsis-h"></i></span>
                                    <span class="title">Lainnya</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="dashboard-right">
                    <router-view v-slot="{Component}">
                        <transition name="route" mode="out-in">
                            <component :is='Component'></component>
                        </transition>
                    </router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from '@/config/app'
import LogoutModal from '@/components/modals/Logout.vue'
export default {
    data() {
        return {
            apiURL: config.apiURL,
            homeURL: config.homeURL,
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            authenticated: 'auth/authenticated',
            barang: 'barang/all_barang',
            barangDasar: 'barang/barang_dasar',
            barangMenengah: 'barang/barang_menengah',
            barangLanjut: 'barang/barang_lanjut'
        }),
    },
    created(){
        this.$store.dispatch('barang/getBarang')
    },
    components: { LogoutModal },
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/dashboard.scss';
</style>