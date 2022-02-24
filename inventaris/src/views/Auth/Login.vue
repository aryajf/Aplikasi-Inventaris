<template>
    <div class="container-fluid">
        <div class="row login">
            <div class="col-md-6 bg-lightblue login-left">
                <div class="container">
                    <h1>Inventaris<br>Psikologi</h1>
                </div>
            </div>
            <div class="col-md-6 bg-white login-right">
                <div class="container">
                        <img src="@/assets/images/login.png" alt="gambar login">
                        <h1 class="mt-3">Welcome Back</h1>
                    <div class="box">
                        <form @submit.prevent="login">
                            <div class="mb-3">
                                <div class="p-input-icon-right w-100">
                                    <InputText type="email" class="w-100" placeholder="E-Mail Address" v-model="form.email" :class="{'p-invalid': formErrors.email && formErrors.email.length > 0}" />
                                    <i v-if="!btnLoading" class="pi pi-envelope"/><i v-else class="pi pi-spin pi-spinner"/>
                                </div>
                                <div class="text-danger text-sm" v-if="formErrors.email">*{{formErrors.email[0]}}</div>
                            </div>

                            <div class="mb-3">
                                <div class="p-input-icon-right w-100">
                                    <InputText type="password" class="w-100" placeholder="Password" v-model="form.password" :class="{'p-invalid': formErrors.password && formErrors.password.length > 0}" />
                                    <i v-if="!btnLoading" class="pi pi-key"/><i v-else class="pi pi-spin pi-spinner"/>
                                </div>
                                <div class="text-danger text-sm" v-if="formErrors.password">*{{formErrors.password[0]}}</div>
                            </div>

                            <div class="text-center">
                                <Button type="submit" icon="pi pi-arrow-right" class="p-button-rounded p-button-info" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import store from '@/store'
import appConfig from '@/config/app'

const form = ref({
    email: '',
    password: ''
})

const btnLoading = computed(() => store.getters['btnLoading'])
const formErrors = computed(() => store.getters['formErrors'])

const login = () => {
    store.dispatch('auth/login', form.value)
}
</script>
<style lang="scss">
@import "@/assets/sass/login.scss";
</style>