前面的 Vue 章节，是基础，也是对 Vue 2 光荣的回顾。

本章作为教程的尾声，将介绍 Vue 3 最强大的新功能之一：组合式 API 。

## 什么是组合式API

**强烈建议**大家先去读读[官方文档](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)，把组合式 API 的涵义和作用讲得非常清楚。总结成几句话就是：

- Vue 2 能够很好的胜任任何中小大型项目，但是对于超大型项目（几百个以上的组件）有天生的缺陷，最显著的矛盾是**逻辑关注点分离**：你可能很难短时间分清哪些方法在操作哪些数据、哪些变量又被哪些组件所更改了。
- 组合式 API 将相同逻辑关注点代码聚合在了一起，并且很自然的支持代码复用。

话不多说，接下来让我们将文章列表页面 `ArticleList.vue` 的**选项式API**进化为**组合式API**，用例子感受吧。

## 起步

本章的所有修改只涉及到 `ArticleList.vue` 的 Javascript 脚本部分。

先把旧代码先贴出来：

```javascript
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
    imageIfExists(article) {
      if (article.avatar) {
        return article.avatar.content
      }
    },
    gridStyle(article) {
      if (article.avatar) {
        return {
          display: 'grid',
          gridTemplateColumns: '1fr 4fr'
        }
      }
    },
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
    get_path: function (direction) {
      let url = '';
      try {
        switch (direction) {
          case 'next':
            if (this.info.next !== undefined) {
              url += (new URL(this.info.next)).search
            }
            break;
          case 'previous':
            if (this.info.previous !== undefined) {
              url += (new URL(this.info.previous)).search
            }
            break;
        }
      }
      catch {
        return url
      }
      return url
    },
    get_article_data: function () {
      let url = '/api/article';
      let params = new URLSearchParams();
      params.appendIfExists('page', this.$route.query.page);
      params.appendIfExists('search', this.$route.query.search);
      const paramsString = params.toString();
      if (paramsString.charAt(0) !== '') {
        url += '/?' + paramsString
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
```

一大坨代码扑面而来，已经有点看不清了对吧。

下面开始魔改。

要使用组合式 API，首先要有个入口，也就是 Vue 3 的 `setup()` 函数：

```javascript
export default {

  // 组合式 APi 入口
  setup() {
    return {}
  },

  // 其他代码
  ...
}
```

这就是一个最简单了 `setup()` 了。

**注意：**Vue 执行 `setup()` 的时机非常早，此时 Vue 的实例都尚未生成，因此在 `setup` 中没有 `this`。这意味着除了 `props` 之外，你将无法访问组件中的任何属性：比如**数据**、**计算属性**或**方法**。

现在我们把本地数据 `info` 移动到 `setup()` 里，像下面这样做：

```javascript
import { ref } from 'vue'

export default {
  setup() {
    const info = ref('');

    return {
      info,
    }
  },

  // 旧代码的状态数据，注释掉
  // data: function () {
  //     return {
  //         info: ''
  //     }
  // },
}
```

- 你不能普通的如 `let info = ''` 这样声明状态，这不是**响应式**的，而只是个普通的字符串。因此用 Vue 3 提供的 `ref` 将其包装成一个响应式的对象，和旧的 `data` 中的数据一样。
- 用 `return` 将状态数据返回，Vue 就会将其注入到 Vue 实例的 `this` 中。

刷新下页面，功能无任何变化。

## 获取数据

只把状态数据的位置挪动一下没什么意思，下面试试把获取数据的 `get_article_data()` 方法也改为组合式 API。

改动部分如下：

```javascript
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const info = ref('');
    // 创建路由
    const route = useRoute();
    // 获取文章列表数据的方法
    const get_article_data = function () {
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
    };

    return {
      info,
      get_article_data
    }
  },
  methods: {
    // 把对应的方法注释掉
    // get_article_data: function () {
    //     let url = '/api/article';
    //
    //     let params = new URLSearchParams();
    //     params.appendIfExists('page', this.$route.query.page);
    //     params.appendIfExists('search', this.$route.query.search);
    //
    //     const paramsString = params.toString();
    //     if (paramsString.charAt(0) !== '') {
    //         url += '/?' + paramsString
    //     }
    //
    //     axios
    //         .get(url)
    //         .then(response => (this.info = response.data))
    // }
  },
}
```

看起来只是把方法挪了个地方而已。

但里面有一些很**重要**的区别：

- 由于 `setup()` 里没有 `this` ，自然 `this.$route` 也不能用，必须用 vue-router 的 `useRoute()` 方法手动创建路由对象。（类似的还有 `useRouter()` ）。所有用到 `this` 的地方都进行了对应的调整。
- 用 `ref.value` 可访问到响应式对象中实际保存的数据，比如 `info.value` 。
- 用 `return` 将方法返回。

Vue 实例中用到 `get_article_data()` 有两个地方，分别是 `mounted()` 和 `watch` ，我们把它两兄弟也搬到 `setup()` 中：

```javascript
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const info = ref('');
    const route = useRoute();
    const get_article_data = function () {...};

    onMounted(get_article_data);
    watch(route, get_article_data);

    return {
      info
    }
  },
  // mounted() {
  //     this.get_article_data()
  // },
  // watch: {
  //     $route() {
  //         this.get_article_data()
  //     }
  // }     
}
```

`setup` 中同样不能直接访问生命周期方法和监听方法，因此 Vue 3 提供了 `onMounted` 、 `watch` 作为对应的替代。

> 由于 setup 外不再关注 get_article_data() 方法，因此可以**不用返回**它了。
>
> 此外 `watch(route, ...)` 可能导致潜在的性能问题（控制台警告提示），不过教程为保持简单就不深究了。有关此问题的讨论见[vue-next issues](https://github.com/vuejs/vue-next/issues/2027)。

## 可复用模块

到目前为止都没什么特别的，代码量似乎还更多了。接下来我们试试将与**获取数据**相关的功能抽离成独立的 JS 模块。

新建 `frontend/src/composables/getArticleData.js` 文件，将上面的 `get_article_data()` 函数挪进来：（注意有改动）

```javascript
// frontend/src/composables/getArticleData.js

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
```

注意这里有些**重要的改动**：

- 函数通过参数将响应式对象 `info` 、 `route` 传递进来，以便更新其中所包含的值。由此可见，`ref` 创建的是一个**响应式引用**。你可以在整个程序中安全地传递它，而不必担心在某个地方失去它的响应性。
- `onMounted()` 、 `watch()`  方法都可以抽离到函数模块中，这极大方便了将关注点聚集的能力。
- 将此函数标记为**需要等待返回值**的异步函数（async/await），确保在获取到数据前不会执行后面的操作数据的逻辑。（从而导致报错）

> 你不能在函数体内部重新创建一个 info，那和 setup 中的 info 是两个不同的对象。

接着再来修改 `setup()`：

```javascript
// frontend/src/components/ArticleList.vue

// 注释掉 axios
// import axios from 'axios';

import {ref} from 'vue'
import {useRoute} from 'vue-router'
import getArticleData from '@/composables/getArticleData.js'

export default {
  setup() {
    const info = ref('');
    const route = useRoute();

    getArticleData(info, route);

    return {
      info
    }
  },
  ...
}
```

- 仅需要调用 `get_article_data` 即可。
- 不再需要 axios ，将其注释掉。

刷新页面，功能正常无变化。

## 翻页模块

现在我们已经将获取数据功能抽离为一个独立模块了。

另一块关注点较为集中的逻辑就是`is_page_exists()` 、 `get_page_param()` 和 `get_path()` 三个方法了，其作用都与翻页相关。让我们试着把这三兄弟也抽离出来。

新建 `frontend/src/composables/pagination.js` 文件，把这三个方法挪进来（有改动），并增加一个导出用的接口函数：

```javascript
// frontend/src/composables/pagination.js

// 导出三个方法闭包的接口函数
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

// 判断 下一页/上一页 是否存在
function isPageExists(info, direction) {
  if (direction === 'next') {
    return info.value.next !== null
  }
  return info.value.previous !== null
}

// 获取页码
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

// 获取下一页路径
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
```

三个功能函数都没什么好说的，就还是把与 `this` 相关的部分做了些许处理。接口函数 `pagination()` 用**闭包**将 `info` 、 `route` 两个参数捕获，并随着函数实际调用时传入的 `direction` 参数传递到函数体内部，并返回对应的值。

> 如何理解**捕获**这个词？看看 `getPageParam()` 里用到的三个参数：info、route 和 direction。其中 direction 是函数每次调用时通过参数动态传递进来的，但是 info 和 route 却不是这样，它们是创建 `get_page_param` 闭包时被强行”抓取“进函数体内的对象的引用。这就是所谓的被闭包捕获了。
>
> 闭包的详细用法超出本文的讲解范围，搞不懂的读者朋友可自行找文档补充对应语法知识。

接着修改 `ArticleList.vue` ：

```javascript
// frontend/src/components/ArticleList.vue

...
import pagination from '@/composables/pagination.js'

export default {
  setup() {
    const info = ref('');
    const route = useRoute();

    getArticleData(info, route);

    const {
      is_page_exists,
      get_page_param,
      get_path
    } = pagination(info, route);

    return {
      info,
      is_page_exists,
      get_page_param,
      get_path,
    }
  },
  methods: {
    // 这些东西全部都注释掉了
    // is_page_exists(direction) {...}
    // get_page_param: function (direction) {...},
    // get_path: function (direction) {...},
    // get_article_data: function () {...}

    // 下面是其他方法
    ...
  },
}
```

刷新页面，功能还是应该无变化。

## 收尾工作

现在大部分的逻辑都挪动到 `setup()` 中了，只剩几个调整页面外观的方法仍在 `methods` 中。由于其实现细节不是本文重点，详细过程就略过了，请读者自行尝试。

> 实在折腾不出来的，在 [教程仓库](https://github.com/stacklens/django-vue-tutorial) 找答案吧。

来看看 `ArticleList.vue` 脚本部分最终的**全貌**：

```javascript
import {ref} from 'vue'
import {useRoute} from 'vue-router'
import getArticleData from '@/composables/getArticleData.js'
import pagination from '@/composables/pagination.js'
import articleGrid from '@/composables/articleGrid.js'
import formattedTime from '@/composables/formattedTime.js'

export default {
  name: 'ArticleList',
  setup() {
    const info = ref('');
    const route = useRoute();
    // 获取文章数据
    getArticleData(info, route);
    // 翻页
    const {
      is_page_exists,
      get_page_param,
      get_path
    } = pagination(info, route);
    // 调整页面外观
    const {
      imageIfExists,
      gridStyle
    } = articleGrid();
    // 日期格式化
    const formatted_time = formattedTime;
    // 需要注入到 Vue 实例的数据、方法等
    return {
      info,
      is_page_exists,
      get_page_param,
      get_path,
      imageIfExists,
      gridStyle,
      formatted_time,
    }
  },
}
```

- 函数都被有序的归纳在一起，并且很容易看出哪些方法之间关系更紧密。
- 页面更清爽了。顶层逻辑和底层逻辑各司其职，更有层次。
- 抽离出去的模块显然可以很方便的复用。

重构完成了，感觉如何？

教程只讲了 `methods()` 、 `onMounted()` 和 `watch` 的重构，而实际上 `computed()` 等其他部分都是可以改写为组合式 API 的。因此再一次建议阅读 [官方文档](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)，里面有你入门所需要的绝大部分内容。

一句话，既然你都用 Vue 3 了，那就**多用组合式 API，少用选项式 API**，这是历史洪流。

> 那为什么前面花了那么多力气讲选项式 API？首先它相对容易理解，对新手入门比较友好；其次 Vue 3 对其完全支持，学了不亏；再次将其移植到组合式 API 不困难，无非就是多点函数异步和闭包的理解；最后，不是所有公司都能够马上用上 Vue 3 的，掌握 Vue 2 的核心基础在当下是非常必要的。

