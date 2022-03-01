<template>
    <div>
        <DeleteModal :category_id="category_id"></DeleteModal>
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body">
                <div class="row">
                    <div class="col-xl-9 col-12 top-button">
                        <form action="#" @submit.prevent="submit">
                            <div class="row">
                                <div class="col-12">
                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label for="">
                                                Nama Kategori
                                                <span class="text-danger text-sm" v-if="formErrors.title">*{{formErrors.title[0]}}</span>
                                            </label>
                                            <input type="text" class="form-control" :class="{'is-invalid': formErrors.title && formErrors.title.length > 0}" placeholder="Masukkan nama kategori" v-model="form.title">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <button type="submit" class="btn bg-wa btn-sm d-flex mt-1" :disabled="btnLoading">
                            <i class="uil uil-plus"></i> Tambah Kategori
                            <template v-if="btnLoading">
                                <Pulse />
                            </template>
                        </button>
                        </form>
                    </div>
                    <div class="col-xl-3 col-12 top-form-search">
                        <form action="#">
                            <div class="form-group">
                                <div class="p-input-icon-right">
                                    <i class="pi pi-spin pi-spinner" v-if="searchLoading" />
                                    <i class="pi pi-search" v-else />
                                    <InputText type="text" placeholder="Cari kategori disini" v-model="keyword" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="admin-panel-responsive">
                    <div class="admin-panel">
                        <router-link to="/category" class="btn btn-sm"><i class="uil uil-file-bookmark-alt me-1"></i>
                            Semua Item <span class="badge bg-wa ms-1">{{categories.totalItems}}</span>
                        </router-link>
                    </div>
                </div>

                <template v-if="categories.category && categories.totalItems != 0">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" class="th-1">#</th>
                                    <th scope="col" class="th-5"><i class="uil uil-tag-alt me-2"></i>Nama Kategori</th>
                                    <th scope="col" class="th-10"><i class="uil uil-calendar-alt me-2"></i>Tanggal</th>
                                    <th scope="col" class="th-aksi">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in categories.category" :key="item.id">
                                    <td class="fw-bold text-center">{{ index+1 }}</td>
                                    <td>
                                        {{item.title}}
                                    </td>
                                    <td>
                                        <span class="badge bg-light text-dark text-start me-3">Dibuat: <span class="d-block">{{DateFormat(item.createdAt)}}</span></span>
                                        <span class="badge bg-dark text-start">Diupdate: <span class="d-block">{{DateFormat(item.updatedAt)}}</span></span>
                                    </td>
                                    <td align="center">
                                        <router-link :to="'/category/edit/'+item.id" class="text-primary fs-4"><i class="uil uil-edit"></i></router-link>
                                        <a href="#" class="text-danger fs-4" @click.prevent="getDeleteModal(item.id)" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="uil uil-trash-alt"></i></a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Paginator v-if="categories.totalPages >= 2" @page="changePage($event)" v-model:rows="categories.limitItems" :totalRecords="categories.totalItems" />
                </template>
                <Message v-else severity="info" :closable="false">{{categories.message}}</Message>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import Pulse from '@/components/loader/Pulse.vue'
import DeleteModal from '@/components/modals/Delete.vue'
import Mixins from '@/mixins'

export default {
    mixins: [Mixins],
    data() {
        return {
            category_id: null,
            keyword: null,
            paginationSearch: false,
            form: {
                title: ''
            }
        }
    },
    watch: {
        keyword() {
            this.search()
        },
    },
    computed: {
        ...mapGetters({
            searchLoading: "searchLoading",
            btnLoading: 'btnLoading',
            formErrors: 'formErrors',
            categories: 'category/categories',
        }),
    },
    components: { Pulse, AdminHeader, DeleteModal },
    created() {
        this.getCategories()
    },
    methods: {
        getDeleteModal(id) {
            this.category_id = id
        },
        getCategories() {
            this.paginationSearch = false
            const data = { page: 0 }
            this.$store.dispatch('category/getCategories', data)
        },
        changePage(event) {
            if (this.paginationSearch == true) {
                const data = { keyword: this.keyword, page: event.page }
                this.$store.dispatch('category/searchCategories', data)
            } else {
                const data = { page: event.page }
                this.$store.dispatch('category/getCategories', data)
            }
        },
        search() {
            if (this.keyword != '') {
                this.paginationSearch = true
                const data = { keyword: this.keyword }
                this.$store.dispatch('category/searchCategories', data)
            } else {
                this.paginationSearch = false
                this.getCategories()
            }
        },
        submit() {
            const data = {
                title:this.form.title
            }

            this.$store.dispatch('category/storeCategory', data).then(res => {
                if(res.status === 201){
                    this.form.title = ''
                }
            })
        }
    },
}
</script>

<style lang="scss">
@import '@/assets/sass/app.scss';
</style>