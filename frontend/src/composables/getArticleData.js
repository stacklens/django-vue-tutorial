import axios from 'axios';
import {onMounted, watch} from 'vue'

export default function getArticleData(info, route, page) {
    const getData = async () => {

        const queryPage = route.query.page !== undefined ? parseInt(route.query.page) : 1;
        if (page.value === queryPage) {
            return
        }

        let url = '/api/article';

        let params = new URLSearchParams();
        params.appendIfExists('page', route.query.page);
        params.appendIfExists('search', route.query.search);

        const paramsString = params.toString();
        if (paramsString.charAt(0) !== '') {
            url += '/?' + paramsString
        }

        const response = await axios.get(url);


        info.value = response.data;
        page.value = queryPage;
    };

    onMounted(getData);

    watch(route, getData);
}