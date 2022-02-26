<template>
    <div>
        <!-- CROP GAMBAR MODAL -->
        <div class="modal fade" id="cropModal" tabindex="-1" aria-labelledby="cropModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="cropModalLabel"><i class="uil uil-image-edit me-1"></i>Pilih Foto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="gambarPreview shadow-sm mb-3 text-center">
                            <img v-if="barang.gambar" :src="`${apiURL}images/barang/${barang.gambar}`" class="w-100" alt="gambar">
                            <img v-else src="@/assets/images/image-not-available.png" class="w-100" alt="gambar">
                        </div>
                        <div class="form-group mb-3">
                            <label for="gambar">
                                <span class="btn btn-sm bg-az"><i class="uil uil-export me-1"></i>Pilih Foto</span>
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

        <!-- EDIT BARANG -->
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body">
                <h1 class="admin-body-heading"><i class="uil uil-edit me-1"></i>Edit Barang</h1>
                <form action="#" @submit.prevent="submit">
                    <div class="row">
                        <div class="col-xl-4 col-12">
                            <div class="form-group">
                                <img v-if='imagePreview' :src="imagePreview" alt="image" class="added-image w-100">
                                <img v-else-if="barang.gambar" :src="`${apiURL}images/barang/${barang.gambar}`" :alt="barang.gambar" class="added-image w-100">

                                <label data-bs-toggle="modal" data-bs-target="#cropModal" class="mt-2">
                                    <span class="btn bg-secondary text-white btn-sm">Ganti Gambar<i class="uil uil-image-upload ms-1"></i></span>
                                </label>
                            </div>
                        </div>
                        <div class="col-xl-8 col-12">
                            <div class="row">
                                <div class="form-group col-md-6">
                                    <label for="">
                                        Judul Barang
                                        <span class="text-danger text-sm" v-if="formErrors.title">*{{formErrors.title[0]}}</span>
                                    </label>
                                    <input type="text" class="form-control" :class="{'is-invalid': formErrors.title && formErrors.title.length > 0}" placeholder="Masukkan judul" v-model="barang.title">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="">
                                        Kategori
                                        <span class="text-danger text-sm" v-if="formErrors.category">*{{formErrors.category[0]}}</span>
                                    </label>
                                    <div>
                                        <Dropdown class="w-100" v-model="form.category" :options="categories" :filter="true" optionLabel="name" placeholder="Pilih Kategori" :class="{'p-invalid': formErrors.category && formErrors.category.length > 0}"/>
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
                                Simpan
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
import { mapGetters } from "vuex"
import config from "@/config/app"
import AdminHeader from "@/components/layouts/AdminHeader.vue"
import Pulse from "@/components/loader/Pulse.vue"
import VueCropper from "vue-cropperjs"
import Editor from 'primevue/editor'

export default {
    data() {
        return {
            apiURL: config.apiURL,
            form: {
                category: { id: '', name: '' },
                gambar: '',
                description: '',
            },
            gambarName: '',
            imagePreview: '',
            categories: [],
        }
    },
    components: { AdminHeader, Pulse, VueCropper, Editor },
    computed: {
        ...mapGetters({
            btnLoading: "btnLoading",
            formErrors: "formErrors",
            barang: "barang/barang",
        }),
    },
    created() {
        this.getBarang()
        this.getCategoriesType()
    },
    methods: {
        getCategoriesType() {
            const data = { type: 'barang' }
            this.$store.dispatch('category/getCategoriesType', data).then(res => {
                if(res.status == 200){
                    res.data.category.map(item => {
                        this.categories.push({
                            id: item.id,
                            name: item.title,
                        })
                    })
                }
            })
        },
        getBarang() {
            this.$store
                .dispatch("barang/show", this.$route.params.slug)
                .then((res) => {
                    this.form.description = res.data.barang.description
                    this.form.category.id = res.data.barang.category.id
                    this.form.category.name = res.data.barang.category.title
                })
        },
        onImageChange(e) {
            let file = e.target.files || e.dataTransfer.files
            if (!file.length) {
                return
            }
            let fileType = file[0].type
            if (
                fileType == "image/png" ||
                fileType == "image/jpg" ||
                fileType == "image/jpeg" ||
                fileType == "image/gif"
            ) {
                this.gambarName = file[0].name
                this.createImage(file[0])
            } else {
                e.target.value = ""
                window.notyf.error("Gambar harus gambar (PNG, JPG, JPEG, GIF)")
            }
        },
        createImage(file) {
            let reader = new FileReader()
            reader.onload = (e) => {
                let saveBtn = document.getElementById("saveBtn")
                let cropperCanvas = document.getElementById("cropper-canvas")
                saveBtn.classList.remove("d-none")
                cropperCanvas.classList.remove("d-none")
                this.$refs.cropper.replace(e.target.result)
            }
            reader.readAsDataURL(file)
        },
        formatBytes(a, b = 2) {
            if (0 === a) return "0 Bytes"
            const c = 0 > b ? 0 : b,
                d = Math.floor(Math.log(a) / Math.log(1024))

            return (
                parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
                "" +
                ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
            )
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
            const gambar = new File([this.form.gambar], this.gambarName, {
                lastModified: this.form.gambar.lastModified,
                type: this.form.gambar.type,
            })
            const data = new FormData()
            data.append("gambar", gambar)
            data.append("title", this.barang.title)
            data.append("description", this.form.description)
            data.append('category_id', this.form.category.id)

            this.$store
                .dispatch("barang/updateBarang", [
                    this.$route.params.slug,
                    data,
                ])
        },
    },
}
</script>

<style lang="scss">
@import "@/assets/sass/app.scss";
@import "@/assets/sass/form.scss";
</style>