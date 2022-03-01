<template>
    <div class="bg-white admin-wrapper">
        <AdminHeader />
        <chart />
        <div class="row">
            <div class="col-12">
                <h4 class="text-center my-3">Jumlah Data Barang</h4>
                <div class="d-flex justify-content-between">
                    <div class="form-group">
                        <div class="p-input-icon-right w-100">
                            <i class="pi pi-spin pi-spinner" v-if="searchLoading" />
                            <i class="pi pi-search" v-else />
                            <InputText type="text" class="w-100" placeholder="Cari barang disini" v-model="keyword" />
                        </div>
                    </div>
                    <Button v-if="barang.barang && barang.totalItems != 0 && barang.length != 0" type="button" label="Unduh Laporan" icon="pi pi-download" iconPos="right" :loading="btnLoading" @click="downloadPdf()"/>
                </div>
                <div class="table-responsive" v-if="barang.barang && barang.totalItems != 0 && barang.length != 0">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col" class="th-1">#</th>
                                <th scope="col" class="th-1"><i class="uil uil-package me-2"></i>Nama</th>
                                <th scope="col" class="th-1"><i class="uil uil-tag-alt me-2"></i>Kategori</th>
                                <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Lab Dasar</th>
                                <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Lab Menengah</th>
                                <th scope="col" class="th-1"><i class="uil uil-box me-2"></i>Jumlah Lab Lanjut</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(barang, index) in barang.barang" :key="barang.id">
                                <td class="fw-bold text-center">{{ index+1 }}</td>
                                <td class="text-center"><router-link :to="'/barang/'+barang.slug">{{barang.title}}</router-link></td>
                                <td class="text-center">{{barang.category}}</td>
                                <td class="fw-bold text-center">{{barang.dasar}}</td>
                                <td class="fw-bold text-center">{{barang.menengah}}</td>
                                <td class="fw-bold text-center">{{barang.lanjut}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Message v-else :closable="false" severity="info">Barang belum ditambahkan</Message>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AdminHeader from '@/components/layouts/AdminHeader.vue'
import Chart from '@/components/layouts/Chart.vue'
export default {
    data() {
        return {
            keyword: null,
        }
    },
    watch: {
        keyword() {
            this.search()
        },
    },
    computed: {
        ...mapGetters({
            barang: 'barang_lab',
            searchLoading: "searchLoading",
            btnLoading: "btnLoading",
            user: 'auth/user',
        }),
    },
    created(){
        this.getBarang()
    },
    components: { Chart, AdminHeader },
    methods: {
        search() {
            if (this.keyword != '') {
                const data = { keyword: this.keyword }
                this.$store.dispatch('searchAllBarang', data)
            } else {
                this.getBarang()
            }
        },
        downloadPdf(){
            this.$store.dispatch('downloadPdf')
        },
        getBarang(){
            this.$store.dispatch('allBarang')
        }
    }
}
</script>
<style lang="scss">
@import "@/assets/sass/app.scss";
</style>