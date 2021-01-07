<template>

    <BlogHeader/>

    <ArticleList/>

    <BlogFooter/>

</template>

<script>
    import BlogHeader from '@/components/BlogHeader.vue'
    import BlogFooter from '@/components/BlogFooter.vue'
    import ArticleList from '@/components/ArticleList.vue'


    export default {
        name: 'Home',
        components: {BlogHeader, BlogFooter, ArticleList}
    }
</script>