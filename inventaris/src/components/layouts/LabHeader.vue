<template>
    <div class="admin-header bg-light rounded-top">
        <div class="admin-header-heading">
            <p class="m-0 p-0">
                <a target="_blank" class="text-darkBlue">Lab {{ url }}</a>
            </p>
            <span>Kelola managemen lab {{ url }}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            url: this.$route.path.split('/')[2],
        }
    },
    created() {
        this.$watch(
            () => this.$route.params,
                () => {
                    this.url = this.$route.path.split('/')[2]
                }
            )
    },
}
</script>