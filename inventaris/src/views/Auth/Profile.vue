<template>
    <div>
        <!-- UPLOAD IMAGE MODAL -->
        <imageCropper />
        <div class="container-fluid">
            <div class="barang-box mb-3 bg-light rounded-top">
                <div class="row">
                    <div class="col-md-3 col-12">
                        <div v-if="user.avatar" class="avatar">
                            <button class="btn rounded-circle shadow" data-bs-toggle="modal" data-bs-target="#avatarModal"><i class="uil uil-pen"></i></button>
                            <img class="rounded-circle shadow-sm w-100" :src="apiURL+'images/avatars/'+user.avatar" alt="avatar">
                        </div>
                        <div v-else class="avatar">
                            <button class="btn rounded-circle shadow" data-bs-toggle="modal" data-bs-target="#avatarModal"><i class="uil uil-pen"></i></button>
                            <img class="rounded-circle shadow-sm w-100" src="@/assets/images/no-avatar.png" alt="avatar">
                        </div>
                    </div>
                    <div class="col-md-8 offset-md-1 col-12 barang-box-heading">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h2>{{user.nama}}</h2>
                                <p>{{user.email}}</p>
                                <div>Nomor Telepon: <span v-if="user.phone">+62 {{user.phone}}</span><span v-else>Belum ditambahkan</span></div>
                            </div>
                            <div>
                                <h5><span v-if="user.role != 'Admin'">Asisten Lab </span>{{ user.role }}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <div class="profile-menu text-center">
                        <button id="btn-profile" @click="changePage('profile')">Change Profile</button>
                        <button id="btn-password" @click="changePage('password')">Change Password</button>
                    </div>
                </div>
                <template v-if="page === 'profile'">
                    <form @submit.prevent="updateProfile">
                        <div class="row d-flex justify-content-center my-5">
                            <div class="col-md-3 mb-3">
                                <label for="">Nama <span class="text-danger text-sm" v-if="formErrors.nama">*{{formErrors.nama[0]}}</span></label>
                                <span class="p-input-icon-left w-100">
                                    <i class="pi pi-user" />
                                    <InputText class=" w-100" type="text" v-model="user.nama" placeholder="Nama User" :class="{'p-invalid': formErrors.nama && formErrors.nama.length > 0}" />
                                </span>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="">Nomor Telepon <span class="text-danger text-sm" v-if="formErrors.phone">*{{formErrors.phone[0]}}</span></label>
                                <div class="p-inputgroup">
                                    <span class="p-inputgroup-addon">
                                        +62
                                    </span>
                                    <InputNumber class="w-100" v-model="user.phone" mode="decimal" placeholder="Nomor Telepon" :useGrouping="false" :class="{'p-invalid': formErrors.phone && formErrors.phone.length > 0}"/>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3 d-flex align-items-end">
                                <Button type="submit" class=" w-100" label="Ubah Profil" icon="pi pi-check" iconPos="right" :loading="btnLoading" />
                            </div>
                        </div>
                    </form>
                </template>
                <template v-else-if="page === 'password'">
                    <form @submit.prevent="changePassword">
                        <div class="row d-flex justify-content-center my-5">
                            <div class="col-md-12 mb-3">
                                <label for="">Password Lama <span class="text-danger text-sm" v-if="formErrors.oldPassword">*{{formErrors.oldPassword[0]}}</span></label>
                                <span class="p-input-icon-left w-100">
                                    <i class="pi pi-lock" />
                                    <InputText class=" w-100" type="text" v-model="form.oldPassword" placeholder="Password Lama" :class="{'p-invalid': formErrors.oldPassword && formErrors.oldPassword.length > 0}" />
                                </span>
                            </div>
                            <div class="col-md-12 mb-3">
                                <label for="">Password Baru <span class="text-danger text-sm" v-if="formErrors.newPassword">*{{formErrors.newPassword[0]}}</span></label>
                                <span class="p-input-icon-left w-100">
                                    <i class="pi pi-lock" />
                                    <InputText class=" w-100" type="text" v-model="form.newPassword" placeholder="Password Baru" :class="{'p-invalid': formErrors.newPassword && formErrors.newPassword.length > 0}" />
                                </span>
                            </div>
                            <div class="col-md-12 mb-3">
                                <label for="">Konfirmasi Password Baru <span class="text-danger text-sm" v-if="formErrors.confirmNewPassword">*{{formErrors.confirmNewPassword[0]}}</span></label>
                                <span class="p-input-icon-left w-100">
                                    <i class="pi pi-lock" />
                                    <InputText class=" w-100" type="text" v-model="form.confirmNewPassword" placeholder="Konfirmasi Password Baru" :class="{'p-invalid': formErrors.confirmNewPassword && formErrors.confirmNewPassword.length > 0}" />
                                </span>
                            </div>
                            <div class="col-md-3 mb-3 d-flex align-items-end">
                                <Button type="submit" class=" w-100" label="Ubah Password" icon="pi pi-check" iconPos="right" :loading="btnLoading" />
                            </div>
                        </div>
                    </form>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import imageCropper from "@/components/layouts/imageCropper.vue"
import config from "@/config/app"
export default {
    data(){
        return{
            apiURL: config.apiURL,
            page: 'profile',
            form: {
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            }
        };
    },
    computed: {
        ...mapGetters({
            btnLoading: "btnLoading",
            formErrors: "formErrors",
            user: "auth/user",
        }),
    },
    components:{imageCropper},
    methods: {
        updateProfile(){
            this.$store.dispatch('auth/updateProfile', this.user)
        },
        changePage(page){
            let btnProfile = document.getElementById('btn-profile')
            let btnPassword = document.getElementById('btn-password')

            if (page == 'profile') {
                btnProfile.classList.add('active')
                btnPassword.classList.remove('active')
            } else if (page == 'password') {
                btnProfile.classList.remove('active')
                btnPassword.classList.add('active')
            }
            this.page = page
        },
        changePassword(){
            this.$store.dispatch('auth/changePassword', this.form)
        },
    }
}
</script>
<style lang="scss">
@import '@/assets/sass/app.scss';
@import '@/assets/sass/form.scss';
@import '@/assets/sass/barang.scss';
@import '@/assets/sass/profile.scss';
</style>