/**
 * 订阅推送
 * 陈浩 2019/5/11
 */

/**
 * 储存订阅的内部变量，所有订阅信息均存储在此，此变量不对外暴露
 */
const member = {}

/**
 * 订阅
 * 参数：
 *  title：String 订阅的名称，所有推送名与其相同的订阅均会获得推送
 *  f：function 订阅执行函数，推送时会执行此函数，此函数内可以接收一个推送时传递的参数
 *  params: Object {
 *    proxy: Boolean 代理，推送时有可能还没有订阅，若代理为true，并且发生这种情况则订阅时立即执行一遍f
 *    once: Boolean 执行一次，若为true则推送执行一遍时立即删除此订阅
 *    del: Boolean 执行一次，若为true则推送执行一遍时立即删除所有相同title的所有订阅
 *    lock: Boolean 锁定订阅，只准许订阅一次，无论订阅多少次，始终只有第一次订阅生效
 *    replace: Boolean|String 替换订阅，只允许同时存在一个相同title的订阅，无论订阅多少次，始终只保留最后一次订阅，如果值为String则替换Key值为String的订阅..
 *    key: String 自定义Key值，重复的key会替换前者
 *  }
 * 返回：key：String 返回一个此订阅唯一标识，可使用此标识删除此订阅
 */
function subscribe(title, f, params = {
  proxy: false,
  once: false,
  del: false,
  lock: false,
  replace: false,
}) {

  // 获取参数
  const {
    proxy,
    once,
    del,
    lock,
    replace
  } = params


  // 如果锁定订阅，则不进行订阅
  if (lock && member[title]) return

  if (!member[title]) {

    // 如果订阅不存在则初始化订阅
    member[title] = {
      element: {},
      published: false,
      replace
    }
  } else {

    // 如果替换订阅则删除所有旧的订阅
    if (replace === true) this.unsubscribe(title)
  }

  // 设置当前订阅键值
  const realKey = Math.floor((new Date().getTime() * Math.random())).toString()

  member[title].element[realKey] = {
    handlers: f,
    params: {
      proxy,
      once,
      del
    }
  }

  if (proxy && member[title].published == true) {

    // 如果代理，并且推送过则立即执行
    f(member[title].value)

    // 如果只执行一次则执行完后删除
    if (once) this.unsubscribe(title, realKey)

    // 如果销毁订阅则执行完后销毁整个订阅
    if (del) this.del(title)
  }

  // 返回当前订阅键值
  return realKey
}

/**
 * 取消订阅
 * 参数：
 *  title：String 订阅的名称，删除此名称下特定订阅或所有订阅，取决于key
 *  key：String 订阅标识，删除指定的订阅，若不传入key，则删除title下所有订阅
 */
function unsubscribe(title, key) {
  if (key) {
    delete member[title].element[key]
  } else {
    if (member[title]) {
      for (let key in member[title].element) {
        delete member[title].element[key]
      }
    }
  }
}

/**
 * 删除订阅
 * 参数：
 *  title：String 订阅名称，删除此名称的订阅以及推送所有信息
 */
function del(title) {
  delete member[title]
}

/**
 * 推送
 * 参数：
 *  title：String 订阅的名称，向所有订阅了同样title的订阅进行推送
 *  value：any 传参，推送时可向订阅传送一个参数
 */
function publish(title, value) {

  // 推送时，如果订阅不存在，则初始化该订阅
  if (!member[title]) {
    member[title] = {
      element: {},
      published: true,
      replace: false
    }
  } else {
    member[title].published = true
  }

  // 获取附加值
  member[title].value = value

  // 循环推送所有订阅
  for (let key in member[title].element) {

    if (typeof(member[title].element[key].handlers) == 'function') {

      // 执行方法
      member[title].element[key].handlers(member[title].value)

      if (member[title].element[key]) {

        // 如果只执行一次则执行完后删除
        if (member[title].element[key].params.once) this.unsubscribe(title, key)

        // 如果销毁订阅则执行完后销毁整个订阅
        else if (member[title].element[key].params.del) this.del(title, key)
      }
    }
  }
}

/**
 * 管理器
 * 参数：
 *  title：订阅的名称，若不传此参数则返回所有订阅，若传递此参数则返回指定名称的订阅
 * 返回：
 *  object：Object 返回指定的订阅或所有订阅
 */
function manage(title) {
  return title ? member[title] : member
}

module.exports = {
  subscribe,
  unsubscribe,
  publish,
  manage,
  del
}