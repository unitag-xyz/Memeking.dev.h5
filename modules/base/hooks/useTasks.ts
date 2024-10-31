'use client'

import { useRef } from 'react'

export function useTasks() {
  const tasks = useRef<Record<string, (() => Promise<any>) | Promise<any>>>({})

  function containsTask(key: string) {
    return tasks.current[key] !== undefined
  }

  function createTask({
    key,
    task,
    override,
  }: {
    key: string
    task: (() => Promise<any>) | Promise<any>
    override?: boolean
  }) {
    if (containsTask(key) && !override) return
    else tasks.current[key] = task
  }

  async function getTask<T = any>(key: string) {
    const task = tasks.current[key]
    if (!task) return undefined

    try {
      if (typeof task === 'function') tasks.current[key] = task()
      return (await tasks.current[key]) as T
    } catch (error) {
      removeTask(key)
    }
  }

  function removeTask(key: string) {
    delete tasks.current[key]
  }

  return {
    containsTask,
    createTask,
    getTask,
    removeTask,
  }
}
