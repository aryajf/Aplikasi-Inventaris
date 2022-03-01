<template>
    <div>
        <template v-if="categoriesData">
            <div class="row d-flex justify-content-around align-items-center" v-if="categoriesData.labels.length != 0">
                <div class="col-md-4">
                    <h4 class="text-center my-3">Jumlah Stok Barang</h4>
                    <Chart type="pie" :data="barangData" />
                </div>
                <div class="col-md-5">
                    <h4 class="text-center my-3">Jumlah barang yang berada di kategori</h4>
                    <Chart type="pie" :data="categoriesData" />
                </div>
            </div>
            <template v-else>
                <Message :closable="false" severity="info">Kategori belum ditambahkan</Message>
            </template>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from 'primevue/chart'
export default {
    created() {
        this.getCharts()
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
        }),
    },
    methods: {
        getCharts() {
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
            this.$store.dispatch("chartBarang").then(res => {
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
    },
    components: { Chart },
    data() {
        return {
            barangData: null,
            categoriesData: null,
        }
    }
}
</script>