export default function pagination(info, route) {

    const is_page_exists = (direction) => {
        return isPageExists(info, direction)
    };

    const get_page_param = (direction) => {
        return getPageParam(info, route, direction)
    };

    const get_path = (direction) => {
        return getPath(info, direction)
    };


    return {
        is_page_exists,
        get_page_param,
        get_path,
    }
}

function isPageExists(info, direction) {

    if (direction === 'next') {
        return info.value.next !== null
    }
    return info.value.previous !== null


}

function getPageParam(info, route, direction) {
    try {
        let url_string;
        switch (direction) {
            case 'next':
                url_string = info.value.next;
                break;
            case 'previous':
                url_string = info.value.previous;
                break;
            default:
                return route.query.page
        }

        const url = new URL(url_string);
        return url.searchParams.get('page')
    }
    catch (err) {
        return
    }
}

function getPath(info, direction) {
    let url = '';

    try {
        switch (direction) {
            case 'next':
                if (info.value.next !== undefined) {
                    url += (new URL(info.value.next)).search
                }
                break;
            case 'previous':
                if (info.value.previous !== undefined) {
                    url += (new URL(info.value.previous)).search
                }
                break;
        }
    }
    catch {
        return url
    }

    return url
}