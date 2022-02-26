<template>
    <div class="admin-header bg-light rounded-top">
        <div class="admin-header-heading">
            <p class="m-0 p-0">
                <a target="_blank" class="text-darkBlue">{{ url }}</a>
            </p>
            <span>Kelola managemen {{ url }}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            url: this.$route.path.split('/')[1],
        }
    }
}
</script>