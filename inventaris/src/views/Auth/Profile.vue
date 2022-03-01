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
                                <h5>{{user.role}}</h5>
                            </div>
                        </div>
                        <!-- <p class="mt-1" v-html="barang.description"></p> -->
                    </div>
                </div>
                <form @submit.prevent="updateProfile">
                    <div class="row d-flex justify-content-center my-5">
                        <div class="col-md-3 mb-3">
                            <span class="p-input-icon-left w-100">
                                <i class="pi pi-user" />
                                <InputText class=" w-100" type="text" v-model="user.nama" placeholder="Nama User" />
                            </span>
                        </div>
                        <div class="col-md-3 mb-3">
                            <InputNumber class=" w-100" v-model="user.phone" mode="decimal" placeholder="Nomor Telepon" :useGrouping="false" />
                        </div>
                        <div class="col-md-3 mb-3">
                            <Button type="submit" class=" w-100" label="Ubah Profil" icon="pi pi-check" iconPos="right" :loading="btnLoading" />
                        </div>
                    </div>
                </form>
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
        }
    }
}
</script>
<style lang="scss">
@import '@/assets/sass/app.scss';
@import '@/assets/sass/form.scss';
@import '@/assets/sass/barang.scss';
</style>