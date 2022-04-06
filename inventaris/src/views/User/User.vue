<template>
    <div v-if="users">
        <CreateUser />
        <DeleteModal :user_id="user_id"></DeleteModal>
        <div class="bg-white admin-wrapper">
            <div class="admin-body">
                <AdminHeader />
                <div class="row mt-3">
                    <div class="col-xl-5 col-12 top-button">
                        <a href="#" class="btn bg-purple btn-sm" data-bs-toggle="modal" data-bs-target="#createUserModal"><i class="uil uil-plus"></i> Daftarkan User
                        </a>
                    </div>
                    <div class="col-xl-7 col-12 top-form-search">
                        <div class="row">
                            <div class="col">
                                <Dropdown :filter="true" v-model="type" :options="roles" optionLabel="name" placeholder="Pilih Tipe Asisten" class="w-100" />
                            </div>
                            <div class="col">
                                <form action="#">
                                    <div class="form-group">
                                        <div class="input-group">
                                            <input v-model="keyword" type="text" class="form-control" placeholder="Cari disini...">
                                            <span class="input-group-text">
                                                <template v-if="!btnLoading">
                                                    <i class="uil uil-search"></i>
                                                </template>
                                                <template v-else>
                                                    <Pulse />
                                                </template>
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="admin-panel-responsive">
                    <div class="admin-panel">
                        <router-link to="/user" class="btn btn-sm"><i class="uil uil-users-alt me-1"></i>
                            Total Users <span class="badge bg-purple ms-1">{{users.totalItems}}</span>
                        </router-link>
                    </div>
                </div>

                <template v-if="users.users && users.totalItems != 0">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col" class="th-avatar"><i class="uil uil-user-circle me-1"></i>Avatar</th>
                                    <th scope="col" class="th-nama"><i class="uil uil-user me-1"></i>Nama Lengkap</th>
                                    <th scope="col" class="th-email"><i class="uil uil-at me-1"></i>Email</th>
                                    <th scope="col" class="th-alamat"><i class="uil uil-user me-1"></i>Role User</th>
                                    <th scope="col" class="th-aksi">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in users.users" :key="item.id">
                                    <td class="fw-bold">{{ index+1 }}</td>
                                    <td align="center">
                                        <template v-if="item.avatar == null">
                                            <img src="@/assets/images/no-avatar.png" class="w-100 rounded-circle shadow-sm" alt="Foto User">
                                        </template>
                                        <template v-else>
                                            <img :src="`${apiURL}images/avatars/${item.avatar}`" alt="Foto User" class="w-100 rounded-circle shadow-sm">
                                        </template>
                                    </td>
                                    <td>
                                        <router-link :to="'/user/'+item.id" class="d-block text-decoration-none text-wa mb-1">
                                            {{item.nama}}
                                        </router-link>
                                        <div>
                                            <span class="badge bg-light text-dark">
                                                <i class="uil uil-phone-alt me-1"></i>
                                                <template v-if="item.phone != null">+62 {{item.phone}}</template>
                                                <template v-else>Belum diisi</template>
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <a :href="'mailto:'+item.email" class="text-decoration-none d-block mb-1" title="Send Email">
                                            {{item.email}} <i class="uil uil-share ms-1"></i>
                                        </a>
                                    </td>
                                    <td>
                                        <span v-if="item.role != 'Admin'">Asisten Lab </span>{{ item.role }}
                                    </td>
                                    <td align="center">
                                        <template v-if="authenticated.email === item.email || item.role === 'SuperAdmin'">
                                        </template>
                                        <template v-else>
                                            <router-link :to="'/user/'+item.id" class="text-dark fs-4">
                                                <i class="uil uil-eye"></i>
                                            </router-link>
                                            <a href="#" class="text-danger fs-4" @click.prevent="getDeleteModal(item.id)" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="uil uil-trash-alt"></i></a>
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Paginator v-if="users.totalPages >= 2" @page="changePage($event)" v-model:rows="users.limitItems" :totalRecords="users.totalItems" />
                </template>
                <Message v-else severity="info" :closable="false">{{users.message}}</Message>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pulse from '@/components/loader/Pulse.vue'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import DeleteModal from '@/components/modals/Delete.vue'
import CreateUser from '@/views/user/Create.vue'
import config from "@/config/app"

export default {
    data() {
        return {
            apiURL: config.apiURL,
            user_id: null,
            keyword: '',
            type: {name: ''},
            roles: [
                {name: 'All Roles'},
                {name: 'Dasar'},
                {name: 'Menengah'},
                {name: 'Lanjut'}
            ],
        }
    },
    watch: {
        type() {
            this.getUsers()
        },
        keyword() {
            this.getUsers()
        },
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            users: 'user/users',
            authenticated: "auth/authenticated",
        }),
    },
    components: {
        AdminHeader,
        CreateUser,
        Pulse,
        DeleteModal,
    },
    created() {
        this.getUsers()
    },
    methods: {
        getDeleteModal(id) {
            this.user_id = id
        },
        getUsers() {
            this.$store.dispatch('user/getUsers',
            {
                type: this.type.name,
                keyword: this.keyword
            }
            )
        },
        changePage(event) {
            this.$store.dispatch('user/getUsers',
                {
                    page: event.page,
                    type: this.type.name,
                    keyword: this.keyword
                }
            )
        },
    },
}
</script>

<style lang="scss">
@import "@/assets/sass/app.scss";
</style>