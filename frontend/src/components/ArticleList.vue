<template>
    <div v-for="article in info.results" v-bind:key="article.url" id="articles">
        <div>
            <span v-for="tag in article.tags" v-bind:key="tag" class="tag">{{ tag }}</span>
        </div>

        <!--<div class="article-title">-->
        <!--{{ article.title }}-->
        <!--</div>-->

        <div class="a-title-container">
            <router-link
                    :to="{ name: 'ArticleDetail', params: { id: article.id }}"
                    class="article-title"
            >
                {{ article.title }}
            </router-link>
        </div>

        <div>{{ formatted_time(article.created) }}</div>
    </div>


    <div id="paginator">
        <span v-if="is_page_exists('previous')">
            <router-link :to="{ name: 'Home', query: { page: get_page_param('previous') } }">
                Prev
            </router-link>
        </span>
        <span class="current-page">
            {{ get_page_param('current') }}
        </span>
        <span v-if="is_page_exists('next')">
            <router-link :to="{ name: 'Home', query: { page: get_page_param('next') } }">
                Next
            </router-link>
        </span>
    </div>

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
            this.get_article_data()
        },
        methods: {
            formatted_time: function (iso_date_string) {
                const date = new Date(iso_date_string);
                return date.toLocaleDateString()
            },
            is_page_exists(direction) {
                if (direction === 'next') {
                    return this.info.next !== null
                }
                return this.info.previous !== null
            },
            get_page_param: function (direction) {
                try {
                    let url_string;
                    switch (direction) {
                        case 'next':
                            url_string = this.info.next;
                            break;
                        case 'previous':
                            url_string = this.info.previous;
                            break;
                        default:
                            return this.$route.query.page
                    }

                    const url = new URL(url_string);
                    return url.searchParams.get('page')
                }
                catch (err) {
                    return
                }
            },
            get_article_data: function () {
                let url = '/api/article';
                const page = Number(this.$route.query.page);
                if (!isNaN(page) && (page !== 0)) {
                    url = url + '/?page=' + page;
                }

                axios
                    .get(url)
                    .then(response => (this.info = response.data))
            }
        },
        watch: {
            $route() {
                this.get_article_data()
            }
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
    }

    .a-title-container {
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

    #paginator {
        text-align: center;
        padding-top: 50px;
    }

    a {
        color: black;
    }

    .current-page {
        font-size: x-large;
        font-weight: bold;
        padding-left: 10px;
        padding-right: 10px;
    }

</style>
