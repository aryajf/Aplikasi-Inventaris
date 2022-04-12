<template>
    <div class="container">
        <div class="row d-flex justify-content-around align-items-center">
            <template v-if="user.role == 'Admin'">
                <div class="col-md-4" v-if="typeData">
                    <h4 class="text-center my-3">Jumlah Barang Laboratorium</h4>
                    <Chart type="pie" :data="typeData" />
                </div>
                <div v-else class="col-md-4">
                    <Message :closable="false" severity="info">Barang belum ditambahkan</Message>
                </div>
            </template>
            <template v-else>
                <div class="col-md-4">
                    <h4 class="text-center my-3">Jumlah Kategori</h4>
                    <Chart type="pie" :data="categoriesData" />
                </div>
            </template>
            <template v-if="user.role == 'Admin'">
                <template v-if="type.name && type.name != 'Semua Tipe'">
                    <div class="col-md-4" v-if="barangData && barangData.labels.length != 0">
                        <h4 class="text-center my-3">Jumlah Barang Lab {{type.name}}</h4>
                        <Chart type="pie" :data="barangData" />
                    </div>
                    <div v-else class="col-md-4">
                        <Message :closable="false" severity="info">Barang belum ditambahkan</Message>
                    </div>
                </template>
                <div v-else class="col-md-4">
                    <Message :closable="false" severity="info">Lab belum dipilih</Message>
                </div>
            </template>
            <template v-else>
                <div class="col-md-4" v-if="barangData && barangData.labels.length != 0">
                    <h4 class="text-center my-3">Jumlah Barang Lab {{type.name}}</h4>
                    <Chart type="pie" :data="barangData" />
                </div>
                <div v-else class="col-md-4">
                    <Message :closable="false" severity="info">Barang belum ditambahkan</Message>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from 'primevue/chart'
export default {
    created() {
        this.chartType()
        if(this.user.role !== 'Admin'){
            this.chartBarang(this.user.role)
            this.chartCategories()
        }
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            user: 'auth/user',
        }),
    },
    props: {
        type: Object
    },
    watch: {
        type() {
            this.chartBarang(this.type.name)
        },
    },
    methods: {
        chartType() {
            this.$store.dispatch("chartType").then(res => {
                if(res.status === 200){
                    this.typeData = {
                        labels: res.data.typeName,
                        datasets: [
                            {
                                data: res.data.typeStock,
                                backgroundColor: res.data.typeColor
                            },
                        ]
                    }
                }
            })
        },
        chartBarang(type) {
            this.$store.dispatch("chartBarang", type).then(res => {
                if(res.status === 200){
                    this.barangData = {
                        labels: res.data.barangName,
                        datasets: [
                            {
                                data: res.data.barangStock,
                                backgroundColor: res.data.barangColor
                            },
                        ]
                    }
                }
            })
        },
        chartCategories() {
            this.$store.dispatch("chartCategories").then(res => {
                if(res.status === 200){
                    this.categoriesData = {
                        labels: res.data.categoriesName,
                        datasets: [
                            {
                                data: res.data.categoriesStock,
                                backgroundColor: res.data.categoriesColor
                            },
                        ]
                    }
                }
            })
        },
    },
    components: { Chart },
    data() {
        return {
            typeData: null,
            barangData: null,
            categoriesData: null,
        }
    }
}
</script>