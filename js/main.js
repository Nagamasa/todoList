// ローカルストレージに保存
let STORAGE_KEY = 'todoList'
let todoStorage = {
  fetch: function() {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    
    todoStorage.id = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}
const PRIORITY_HIGH = 4,
      PRIORITY_MIDOLLE = 3,
      PRIORITY_LOW = 2

const app = new Vue({
  el: '#app',
  data () {
    return {
      todos: [],
      options: [
        {value: -1, label: 'all', refine: true},
        {value: 0, label: 'working', refine: true},
        {value: 1, label: 'completed', refine: true},
        {value: 2, label: '低', refine: false},
        {value: 3, label: '中', refine: false},
        {value: 4, label: '高', refine: false}
      ],
      priority: 'priority',
      sortByKey: '',
      sortOrder: 1,
      current: -1
    }
  },
  methods: {
    // todoの追加処理
    doAdd: function(event, value) {

      let task = this.$refs.taskText
      let date = this.$refs.date
      
      if (!task.value.length) {
        return
      }

      this.todos.push({
        id: todoStorage.id++, 
        task: task.value,
        state: 0,
        deadline: date.value,
        priority: PRIORITY_HIGH
      })
      // フォーム要素を空にする
      task.value = ''
    },
    // 状態変更処理
    doChangeState: function(item) {
      item.state = item.state ? 0 : 1
    },
    // 優先度変更処理
    doChangePriority: function(item) {
      if (item.priority === PRIORITY_HIGH) {
        item.priority = PRIORITY_MIDOLLE
        return
      }

      if (item.priority === PRIORITY_MIDOLLE) {
        item.priority = PRIORITY_LOW
        return
      }
      
      item.priority = PRIORITY_HIGH
      return
    },
    // sort昇順、降順変更処理
    changeSortOrder: function() {
      this.sortOrder *= -1
    },
    // sortKey設定
    setSortKey: function(key) {
      this.sortByKey = key
    },
    // 削除処理
    doRemove: function(item) {
      let index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    },
    // 一括削除
    doAllRemove: function() {
      this.todos = []
    },
  },
  watch: {
    // todoデータ変更時、save処理実施
    todos: {
      handler: function(todos) {
        todoStorage.save(todos)
      },
      // ネストしているデータも監視
      deep: true
    }
  },
  created() {
    // インスタンス生成時に自動的にfetch実施
    this.todos = todoStorage.fetch()
  },
  computed: {
    // データを絞り込む
    computedTodos() {
      let sortByKey = this.sortByKey
      let order = this.sortOrder
      let current = this.current
    
      if (sortByKey) {
        this.sortByKey = ''

        return this.todos.sort(function(a, b) {
          return (a[sortByKey] > b[sortByKey]) ? order : (a[sortByKey] < b[sortByKey]) ? - order : 0
        })
      }

      return this.todos.filter(function(el) {
        return current < 0 ? true : current === el.state
      }, this)
    },
    // valueからlabelに変換
    labels() {
      return this.options.reduce(function(a, b) {
        return Object.assign(a, { [b.value]: b.label })
      })
    },
  }
})

