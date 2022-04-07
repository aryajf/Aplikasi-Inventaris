<template>
    <div class="container">
        <div class="row d-flex justify-content-around align-items-center">
            <div class="col-md-4" v-if="typeData">
                <h4 class="text-center my-3">Jumlah Barang Laboratorium</h4>
                <Chart type="pie" :data="typeData" />
            </div>
            <div v-else class="col-md-4">
                <Message :closable="false" severity="info">Barang belum ditambahkan</Message>
            </div>
            <div class="col-md-4" v-if="type.name && barangData && barangData.labels.length != 0">
                <h4 class="text-center my-3">Jumlah Barang Lab {{type.name}}</h4>
                <Chart type="pie" :data="barangData" />
            </div>
            <div v-else class="col-md-4">
                <Message :closable="false" severity="info">Barang belum ditambahkan</Message>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from 'primevue/chart'
export default {
    created() {
        this.chartType()
    },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
        }),
    },
    props: {
        type: Object
    },
    watch: {
        type() {
            this.chartBarang()
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
        chartBarang() {
            this.$store.dispatch("chartBarang", this.type.name).then(res => {
                console.log(res)
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
            typeData: null,
            barangData: null,
        }
    }
}
</script>