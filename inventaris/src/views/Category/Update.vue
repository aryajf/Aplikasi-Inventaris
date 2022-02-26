<template>
    <div>
        <!-- EDIT SHOP -->
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body">
                <h1 class="admin-body-heading"><i class="uil uil-edit me-1"></i>Edit Category</h1>
                <form action="#" @submit.prevent="submit">
                    <div class="row">
                        <div class="col-12">
                            <div class="row">
                                <div class="form-group col-md-6">
                                    <label for="">
                                        Nama Kategori
                                        <span class="text-danger text-sm" v-if="formErrors.title">*{{formErrors.title[0]}}</span>
                                    </label>
                                    <input type="text" class="form-control" :class="{'is-invalid': formErrors.title && formErrors.title.length > 0}" placeholder="Masukkan judul" v-model="category.title">
                                </div>
                            </div>

                            <button type="submit" class="btn bg-wa btn-sm d-flex mt-2" :disabled="btnLoading">
                                Ubah Kategori
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
import AdminHeader from "@/components/layouts/AdminHeader.vue"
import Pulse from "@/components/loader/Pulse.vue"

export default {
    created() {
        this.getCategory()
    },
    components: { AdminHeader, Pulse },
    computed: {
        ...mapGetters({
            btnLoading: "btnLoading",
            formErrors: "formErrors",
            category: "category/category",
        }),
    },
    methods: {
        getCategory() {
            this.$store
                .dispatch("category/getCategory", this.$route.params.id)
                .then((res) => {
                    this.form.type.name = res.data.category.type
                })
        },
        submit() {
            const data = {
                title: this.category.title
            }

            this.$store
                .dispatch("category/updateCategory", [
                    this.$route.params.id,
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