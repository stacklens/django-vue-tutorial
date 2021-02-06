import axios from 'axios';
import {onMounted, watch} from 'vue'

export default function getArticleData(info, route) {
    const getData = async () => {
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
    };

    onMounted(getData);

    watch(route, getData);
}