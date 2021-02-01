import axios from 'axios';

export default function getArticleData(info, route) {
    let url = '/api/article';

    let params = new URLSearchParams();
    params.appendIfExists('page', route.query.page);
    params.appendIfExists('search', route.query.search);

    const paramsString = params.toString();
    if (paramsString.charAt(0) !== '') {
        url += '/?' + paramsString
    }

    axios
        .get(url)
        .then(response => (info.value = response.data))
}