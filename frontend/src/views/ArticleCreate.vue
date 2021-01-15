<template>

    <BlogHeader/>


    <BlogFooter/>

</template>

<script>
    import BlogHeader from '@/components/BlogHeader.vue'
    import BlogFooter from '@/components/BlogFooter.vue'


    export default {
        name: 'ArticleCreate',
        components: {BlogHeader, BlogFooter}
    }
</script>