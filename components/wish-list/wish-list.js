/**
 * 愿望单-列表
 * 陈浩
 * 2019/8/1
 */
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Array,
    } // 列表
  },

  /**
   * 监听
   */
  observers: {
    value(value) {
      this.triggerEvent('change', {
        value
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 选择
     */
    checked(index) {

      // 获取参数
      const value = this.data.value

      // 判断是否全选
      if (index == 'all') {

        // 循环选中
        value.forEach(categoryItem => {
          categoryItem.checked = true
          categoryItem.courses.forEach(courseItem => {
            courseItem.checked = true
          })
        })

        // 设置数据
        this.setData({
          value
        })
      }
    },

    /**
     * 取消选择
     */
    unchecked(index) {

      // 获取参数
      const value = this.data.value

      // 判断是否全选
      if (index == 'all') {

        // 循环选中
        value.forEach(categoryItem => {
          categoryItem.checked = false
          categoryItem.courses.forEach(courseItem => {
            courseItem.checked = false
          })
        })

        // 设置数据
        this.setData({
          value
        })
      }
    },

    /**
     * 分类选择更改
     */
    categoryChange(e) {

      // 获取参数
      const {
        categoryIndex,
      } = e.currentTarget.dataset,
        value = this.data.value

      // 获取课程
      const category = value[categoryIndex]
      const course = category.courses

      // 设置选中
      category.checked = !category.checked

      // 循环设置课程选中
      course.forEach(item => {
        item.checked = category.checked
      })

      // 设置数据
      this.setData({
        value
      })
    },

    /**
     * 课程选择更改
     */
    courseChange(e) {

      // 获取参数
      const {
        categoryIndex,
        courseIndex
      } = e.currentTarget.dataset, {
        value
      } = this.data

      // 获取课程
      const category = value[categoryIndex]
      const course = category.courses[courseIndex]

      // 设置选中
      course.checked = !course.checked

      // 循环设置课程选中
      category.checked = category.courses.every(item => item.checked == true)

      // 设置数据
      this.setData({
        value
      })
    },
  }
})