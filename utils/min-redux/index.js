import React, { useState, useEffect } from 'react'
let state = null
let reducer = null
// 使用发布订阅模式实现变化组件渲染避免无关内容渲染
// 订阅者列表
let listeners = []
const setState = (newState) => {
  state = newState
  // 通知订阅者
  listeners.map((fn) => fn(state))
}

const store = {
  getState () {
    return state
  },
  // dispatch是用来规范setState流程的函数
  dispatch: (action) => {
    setState(reducer(state, action))
  },
  // 订阅
  subscribe (fn) {
    // 添加订阅者
    listeners.push(fn)
    return () => {
      // 取消订阅
      const index = listeners.indexOf(fn)
      listeners.splice(index, 1)
    }
  },
  replaceReducer (newReducer) { },
}

let dispatch = store.dispatch
const preDispatch = dispatch
// 支持异步调用
dispatch = (action) => {
  if (action instanceof Function) {
    actioin(dispatch)
  } else {
    preDispatch(action)
  }
}

const preDispatch2 = dispatch
// 支持异步Promise
dispatch = (action) => {
  if (action.payload instanceof Promise) {
    action.payload.then((data) => {
      dispatch({ ...action, payload: data })
    })
  } else {
    preDispatch2(action)
  }
}

export const createStore = (_reducer, initState) => {
  state = initState
  reducer = _reducer
  return store
}

const changed = (oldState, newState) => {
  let changed = false
  for (const key in oldState) {
    if (oldState[key] !== newState[key]) {
      changed = true
    }
  }
  return changed
}

// connect将组件与全局状态链接
export const connect = (mapStateToProps, mapDispatchToProps) => (Component) => {
  return (props) => {
    const [, update] = useState({})
    const data = mapStateToProps ? mapStateToProps(state) : { state }
    const dispatchers = mapDispatchToProps
      ? mapDispatchToProps(store.dispatch)
      : { dispatch: store.dispatch }
    // 订阅
    useEffect(() => {
      const unsubscribe = store.subscribe(() => {
        const newData = mapStateToProps ? mapStateToProps(state) : { state }
        if (changed(data, newData)) {
          update({})
        }
      })
      // mapStateToProps变化会重复订阅
      return unsubscribe
    }, [mapStateToProps])
    return <Component {...props} {...data} {...dispatchers} />
  }
}

// 1.创建context state
const appContext = React.createContext(null)
export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>
}
