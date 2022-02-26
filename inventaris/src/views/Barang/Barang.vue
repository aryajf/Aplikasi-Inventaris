<template>
    <div>
        <DeleteModal :barang_slug="barang_slug"></DeleteModal>
        <div class="bg-white admin-wrapper">
            <AdminHeader />
            <div class="admin-body">
                <div class="row">
                    <div class="col-xl-9 col-12 top-button">
                        <router-link to="/barang/create" class="btn bg-wa btn-sm"><i class="uil uil-plus"></i> Buat Produk
                        </router-link>
                    </div>
                    <div class="col-xl-3 col-12 top-form-search">
                        <form action="#">
                            <div class="form-group">
                                <div class="input-group">
                                    <input v-model="keyword" type="text" class="form-control" placeholder="Cari disini...">
                                    <span class="input-group-text"><i class="uil uil-search"></i><span v-if="btnLoading" class="ms-1">
                                            <Pulse />
                                        </span></span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="admin-panel-responsive">
                    <div class="admin-panel">
                        <router-link to="/barang" class="btn btn-sm"><i class="uil uil-file-bookmark-alt me-1"></i>
                            Semua Item <span class="badge bg-wa ms-1">{{barang.totalItems}}</span>
                        </router-link>
                    </div>
                </div>

                <template v-if="barang.barang && barang.totalItems != 0">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" class="th-1">#</th>
                                    <th scope="col" class="th-gambar"><i class="uil uil-image me-2"></i>Foto</th>
                                    <th scope="col" class="th-20"><i class="uil uil-file me-2"></i>Nama Barang</th>
                                    <th scope="col" class="th-15"><i class="uil uil-tag-alt me-2"></i>Kategori</th>
                                    <th scope="col" class="th-20"><i class="uil uil-calendar-alt me-2"></i>Tanggal</th>
                                    <th scope="col" class="th-aksi">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in barang.barang" :key="item.id">
                                    <td class="fw-bold">{{ index+1 }}</td>
                                    <td>
                                        <img :src="`${apiURL}images/barang/${item.gambar}`" :alt="item.title" class="w-100 rounded">
                                    </td>
                                    <td>
                                        <span class="d-block mb-1">{{item.title}}</span>
                                        <span class="badge bg-sm me-1">Rp{{NumberFormat(item.harga)}}</span>
                                        <span class="badge" :class="item.stock == 'Tersedia' ? 'bg-ed' : 'bg-az'">{{item.stock}}</span>
                                    </td>
                                    <td>
                                        <span class="d-block mb-1">{{item.category.title}}</span>
                                    </td>
                                    <td>
                                        <span class="badge bg-light text-dark text-start me-2">Dibuat: <span class="d-block">{{DateFormat(item.createdAt)}}</span></span>
                                        <span class="badge bg-dark text-start">Diupdate: <span class="d-block">{{DateFormat(item.updatedAt)}}</span></span>
                                    </td>
                                    <td align="center">
                                        <a :href="barangURL+'/'+item.slug" class="text-dark fs-4" target="_blank">
                                            <i class="uil uil-eye"></i>
                                        </a>
                                        <router-link :to="'/barang/edit/'+item.slug" class="text-primary fs-4"><i class="uil uil-edit"></i></router-link>
                                        <a href="#" class="text-danger fs-4" @click.prevent="getDeleteModal(item.slug)" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="uil uil-trash-alt"></i></a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Paginator v-if="barang.totalPages >= 2" @page="changePage($event)" v-model:rows="barang.limitItems" :totalRecords="barang.totalItems" />
                </template>
                <Message v-else severity="info" :closable="false">{{barang.message}}</Message>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import Pulse from '@/components/loader/Pulse.vue'
import DeleteModal from '@/components/modals/Delete.vue'
import config from '@/config/app'
import Mixins from '@/mixins'

export default {
    mixins: [Mixins],
    data() {
        return {
            apiURL: config.apiURL,
            barangURL: config.barangURL,
            barang_slug: null,
            keyword: null,
            alertSearch: null,
            paginationSearch: false,
            type: 'barang',
        }
    },
    watch: {
        keyword() {
            this.search()
        },
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            barang: 'barang/barang',
        }),
    },
    components: { Pulse, AdminHeader, DeleteModal },
    created() {
        this.getBarang()
        this.getType()
    },
    methods: {
        getType() {
            const pathArray = window.location.pathname.split('/')
            const secondLevelLocation = pathArray[1]
            this.type = secondLevelLocation
        },
        getDeleteModal(slug) {
            this.barang_slug = slug
        },
        getBarang() {
            this.paginationSearch = false
            const data = { page: 0 }
            this.$store.dispatch('barang/getBarang', data)
        },
        changePage(event) {
            if (this.paginationSearch == true) {
                const data = { keyword: this.keyword, page: event.page }
                this.$store.dispatch('barang/searchBarang', data)
            } else {
                const data = { page: event.page }
                this.$store.dispatch('barang/getBarang', data)
            }
        },
        search() {
            if (this.keyword != '') {
                this.paginationSearch = true
                const data = { keyword: this.keyword }
                this.$store.dispatch('barang/searchBarang', data)
            } else {
                this.paginationSearch = false
                this.getBarang()
            }
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/sass/app.scss';
</style>