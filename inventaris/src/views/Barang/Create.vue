<template>
    <div>
        <!-- CROP GAMBAR MODAL -->
        <div class="modal fade" id="cropModal" tabindex="-1" aria-labelledby="cropModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="cropModalLabel"><i class="uil uil-image-edit me-1"></i>Choose Gambar</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="gambarPreview shadow-sm mb-3 text-center">
                            <img src="@/assets/images/image-not-available.png" class="w-100" alt="gambar">
                        </div>
                        <div class="form-group mb-3">
                            <label for="gambar">
                                <span class="btn btn-sm bg-az"><i class="uil uil-export me-1"></i>Pilih Gambar</span>
                                <button id="saveBtn" class="btn btn-sm btn-primary ms-2 d-none" data-bs-dismiss="modal" @click="cropGambar" :disabled="btnLoading">
                                    <div class="d-flex">
                                        <span>Simpan</span>
                                        <template v-if="btnLoading">
                                            <Pulse />
                                        </template>
                                        <template v-else><i class="uil uil-save ms-1"></i></template>
                                    </div>
                                </button>
                            </label>
                            <input type="file" class="d-none" id="gambar" v-on:change="onImageChange">
                        </div>
                        <div id="cropper-canvas" class="d-none">
                            <vue-cropper ref="cropper" alt="Crop Image" :background="false" :zoomable="true" :movable="false" :aspect-ratio="16 / 9" preview=".gambarPreview" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- CREATE SHOP -->
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body">
                <h1 class="admin-body-heading"><i class="uil uil-plus me-1"></i>Buat Item Baru</h1>
                <form action="#" @submit.prevent="submit">
                    <div class="row">
                        <div class="col-xl-4 col-12">
                            <div class="form-group">
                                <template v-if='imagePreview'>
                                    <img :src="imagePreview" alt="image" class="added-image w-100">
                                    <label data-bs-toggle="modal" data-bs-target="#cropModal" class="mt-2">
                                        <span class="btn bg-secondary text-white btn-sm">Ganti Foto<i class="uil uil-image-upload ms-1"></i></span>
                                    </label>
                                </template>

                                <template v-else>
                                    <label data-bs-toggle="modal" data-bs-target="#cropModal" class="file-upload-gambar bg-light cursor-pointer d-block">
                                        <img src="@/assets/images/file-upload.png" alt="Picture Add" class="default-image">
                                        <p>
                                            Upload Foto
                                            <span class="text-danger d-block" v-if="formErrors.gambar">*{{formErrors.gambar[0]}}</span>
                                        </p>
                                    </label>
                                </template>
                            </div>
                        </div>
                        <div class="col-xl-8 col-12">
                            <div class="row">
                                <div class="form-group col-md-6">
                                    <label for="">
                                        Nama Barang
                                        <span class="text-danger text-sm" v-if="formErrors.title">*{{formErrors.title[0]}}</span>
                                    </label>
                                    <input type="text" class="form-control" :class="{'is-invalid': formErrors.title && formErrors.title.length > 0}" placeholder="Masukkan judul" v-model="form.title">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="">
                                        Kategori
                                        <span class="text-danger text-sm" v-if="formErrors.category">*{{formErrors.category[0]}}</span>
                                    </label>
                                    <div>
                                        <Dropdown class="w-100" v-model="form.category" :options="categories" :filter="true" optionLabel="name" placeholder="Pilih Kategori" :class="{'p-invalid': formErrors.category && formErrors.category.length > 0}" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="">
                                    Keterangan
                                    <span class="text-danger text-sm" v-if="formErrors.description">*{{formErrors.description[0]}}</span>
                                </label>
                                <Editor :class="{'p-invalid': formErrors.description && formErrors.description.length > 0}" v-model="form.description" editorStyle="height: 200px" />
                            </div>

                            <button type="submit" class="btn bg-wa btn-sm d-flex" :disabled="btnLoading">
                                Submit
                                <template v-if="btnLoading">
                                    <Pulse />
                                </template>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import Pulse from '@/components/loader/Pulse.vue'
import VueCropper from 'vue-cropperjs'
import Editor from 'primevue/editor'

export default {
    data() {
        return {
            form: {
                title: '',
                category: { id: '', name: '' },
                gambar: '',
                description: '',
            },
            gambar: '',
            imagePreview: '',
            categories: [],
        }
    },
    components: { AdminHeader, Pulse, VueCropper, Editor },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            formErrors: 'formErrors',
        }),
    },
    created() {
        this.getCategories()
    },
    methods: {
        getCategories() {
            this.$store.dispatch('category/getCategoriesType').then(res => {
                if(res.status == 200){
                    if(res.data.totalItems > 0){
                        res.data.category.map(item => {
                            this.categories.push({
                                id: item.id,
                                name: item.title,
                            })
                        })
                    }
                }
            })
        },
        onImageChange(e) {
            let file = e.target.files || e.dataTransfer.files
            if (!file.length) {
                return
            }
            let fileType = file[0].type
            if (
                fileType == 'image/png' ||
                fileType == 'image/jpg' ||
                fileType == 'image/jpeg' ||
                fileType == 'image/gif'
            ) {
                this.gambar = file[0].name
                this.createImage(file[0])
            } else {
                e.target.value = ''
                window.notyf.error('Foto harus gambar (PNG, JPG, JPEG, GIF)')
            }
        },
        createImage(file) {
            let reader = new FileReader()
            reader.onload = (e) => {
                let saveBtn = document.getElementById('saveBtn')
                let cropperCanvas = document.getElementById('cropper-canvas')
                saveBtn.classList.remove('d-none')
                cropperCanvas.classList.remove('d-none')
                this.$refs.cropper.replace(e.target.result)
            }
            reader.readAsDataURL(file)
        },
        cropGambar() {
            this.imagePreview = this.$refs.cropper
                .getCroppedCanvas()
                .toDataURL()
            this.form.gambar = this.$refs.cropper
                .getCroppedCanvas()
                .toBlob((blob) => {
                    this.form.gambar = blob
                })
        },
        submit() {
            const gambar = new File([this.form.gambar], this.gambar, {
                lastModified: this.form.gambar.lastModified,
                type: this.form.gambar.type,
            })
            const data = new FormData()
            data.append('title', this.form.title)
            data.append('description', this.form.description)
            data.append('category_id', this.form.category.id)
            data.append('gambar', gambar)

            this.$store.dispatch('barang/storeBarang', data)
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/sass/app.scss';
@import '@/assets/sass/form.scss';
</style>