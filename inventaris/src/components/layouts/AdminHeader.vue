<template>
    <div class="admin-header bg-light rounded-top">
        <div class="admin-header-heading">
            <p class="m-0 p-0">
                <a target="_blank" class="text-darkBlue" v-if="url == 'lab'">
                    Semua {{ url }}
                </a>
                <a target="_blank" class="text-darkBlue" v-else>{{ url }}</a>
            </p>
            <span v-if="url == 'lab'">
                Kelola managemen semua {{ url }}
            </span>
            <span v-else>Kelola managemen {{ url }}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            url: this.$route.path.split('/')[1],
            urlSecond: this.$route.path.split('/')[2],
        }
    }
}
</script>