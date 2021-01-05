<template>
    <div v-for="article in info.results" v-bind:key="article.url" id="articles">
        <div>
            <span v-for="tag in article.tags" v-bind:key="tag" class="tag">{{ tag }}</span>
        </div>

        <div class="article-title">
            {{ article.title }}
        </div>

        <div>{{ formatted_time(article.created) }}</div>
    </div>

    <!--<div class="paginator">-->
    <!--<div v-if="info.previous">-->
    <!--<button v-on:click="change_page('previous')">Previous</button>-->
    <!--</div>-->
    <!--<div v-if="info.next">-->
    <!--<button v-on:click="change_page('next')">Next</button>-->
    <!--</div>-->
    <!--</div>-->

</template>

<script>
    import axios from 'axios';


    export default {
        name: 'ArticleList',
        data: function () {
            return {
                info: ''
            }
        },
        mounted() {
            axios
                .get('/api/article')
                .then(response => (this.info = response.data))
        },
        methods: {
            formatted_time: function (iso_date_string) {
                const date = new Date(iso_date_string);
                return date.toLocaleDateString()
            }
            // change_page: function (direction) {
            //
            //     const that = this;
            //
            //     const url = {
            //         'next': function () {
            //             return that.info.next.get_url()
            //         },
            //         'previous': function () {
            //             return that.info.previous.get_url()
            //         }
            //     };
            //
            //     axios
            //         .get(url[direction]())
            //         .then(response => (this.info = response.data))
            // }
        }
    }

</script>

<style scoped>
    #articles {
        padding: 10px;
    }

    .article-title {
        font-size: large;
        font-weight: bolder;
        color: black;
        text-decoration: none;
        padding: 5px 0 5px 0;
    }

    .tag {
        padding: 2px 5px 2px 5px;
        margin: 5px 5px 5px 0;
        font-family: Georgia, Arial, sans-serif;
        font-size: small;
        background-color: #4e4e4e;
        color: whitesmoke;
        border-radius: 5px;
    }
</style>
