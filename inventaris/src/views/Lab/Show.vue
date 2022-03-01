<template>
    <div class="bg-white admin-wrapper">
        <LabHeader />
        <div class="form-group my-3">
            <div class="p-input-icon-right w-100">
                <i class="pi pi-spin pi-spinner" v-if="searchLoading" />
                <i class="pi pi-search" v-else />
                <InputText type="text" class="w-100" placeholder="Cari barang disini" v-model="keyword" />
            </div>
        </div>
        <div class="row d-flex justify-content-around">
            <div class="col-12">
                <template v-if="barang.barang && barang.totalItems != 0">
                    <h4 class="text-center my-3">Jumlah Data Barang</h4>
                    <div class="d-flex justify-content-between">
                        <Button type="button" label="Unduh Laporan" icon="pi pi-download" iconPos="right" :loading="btnLoading" @click="downloadPdfShow()"  />
                    </div>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" class="th-1">#</th>
                                    <th scope="col" class="th-1"><i class="uil uil-package me-2"></i>Nama</th>
                                    <th scope="col" class="th-1"><i class="uil uil-tag-alt me-2"></i>Kategori</th>
                                    <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Tersedia</th>
                                    <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Terpakai</th>
                                    <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Rusak</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(barang, index) in barang.barang" :key="barang.id">
                                    <td class="fw-bold text-center">{{ index+1 }}</td>
                                    <td class="text-center"><router-link :to="'/barang/'+barang.slug">{{barang.title}}</router-link></td>
                                    <td class="text-center">{{barang.category.title}}</td>
                                    <td class="fw-bold text-center">{{barang.tersedia}}</td>
                                    <td class="fw-bold text-center">{{barang.dipakai}}</td>
                                    <td class="fw-bold text-center">{{barang.rusak}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Paginator v-if="barang.totalPages >= 2" @page="changePage($event)" v-model:rows="barang.limitItems" :totalRecords="barang.totalItems" />
                </template>
                <template v-else>
                    <div class="row d-flex justify-content-center align-items-center">
                        <div class="col-md-5">
                            <img class="w-100" src="@/assets/images/puzzle.png" alt="" srcset="">
                        </div>
                        <div class="col-md-5">
                            <h1 class="fw-bold">Barang tidak ditemukan</h1>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import LabHeader from '@/components/layouts/LabHeader.vue'
export default {
    data(){
        return{
            keyword: null,
            url: null,
        };
    },
    watch: {
        keyword() {
            this.search()
        },
    },
    computed: {
        ...mapGetters({
            barang: "show_lab",
            searchLoading: "searchLoading",
            btnLoading: "btnLoading",
            formErrors: "formErrors",
            user: "auth/user",
        }),
    },
    mounted(){
        this.url = this.$route.params.type;
        this.showAllBarang()
    },
    created() {
        this.$watch(
            () => this.$route.params,
                () => {
                    this.url = this.$route.params.type;
                    this.showAllBarang()
                }
            )
    },
    components: { LabHeader },
    methods: {
        search() {
            if (this.keyword != '') {
                const data = { type: this.url, keyword: this.keyword }
                this.$store.dispatch('searchShowBarang', data)
            } else {
                this.showAllBarang()
            }
        },
        downloadPdfShow(){
            this.$store.dispatch('downloadPdfShow', this.url)
        },
        showAllBarang() {
            this.$store.dispatch('showAllBarang', this.url)
        },
    }
}
</script>
<style lang="scss">
@import '@/assets/sass/app.scss';
@import '@/assets/sass/form.scss';
</style>