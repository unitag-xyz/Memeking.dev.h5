export { type CountDown, type TimeUnit, formatCountdown, formatDateString, formatUnitTime }

type CountDown = {
  /**
   * 初始时间数字
   */
  timeStamp?: number

  /**
   * 剩余的总小时数（可能大于24）
   */
  hours: number

  /**
   * 剩余的分钟数
   */
  minutes: number

  /**
   * 剩余的秒数
   */
  seconds: number
}

enum TimeUnit {
  Second = 'second',
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Year = 'year',
}

function formatDateString(
  time: string | number | Date,
  format: string = '{y}-{m}-{d} {h}:{i}:{s}',
) {
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: Record<string, number> = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    M: date.getMonth() + 1,
    d: date.getDate(),
    D: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{([ymMdDhisa])+}/g, (result: any, key: string) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'M' || key === 'D') {
      return String(value)
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

function formatUnitTime(time: number) {
  if (typeof time === 'string') {
    time = (Date.now() - Number(time)) / 1000
  }

  if (time < 60)
    return {
      time,
      unit: TimeUnit.Second,
    }

  time = Math.ceil(time / 60)
  if (time < 60)
    return {
      time,
      unit: TimeUnit.Minute,
    }

  time = Math.ceil(time / 60)
  if (time < 24)
    return {
      time,
      unit: TimeUnit.Hour,
    }

  time = Math.ceil(time / 24)
  if (time >= 365) {
    time = Math.ceil(time / 365)
    return {
      time,
      unit: TimeUnit.Year,
    }
  } else {
    return {
      time,
      unit: TimeUnit.Day,
    }
  }
}

function formatCountdown(timeStamp: number): CountDown {
  const date = new Date(timeStamp)

  return {
    timeStamp: timeStamp,
    hours: Math.floor(timeStamp / 3600000),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds(),
  }
}
