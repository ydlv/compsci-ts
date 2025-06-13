import { removeWhere } from '../../util/crud/remove'

export type Activity = {
  name: string
  start: number
  end: number
}

export function overlaps(a1: Activity, a2: Activity): boolean {
  return a1.end > a2.start && a2.end > a1.start
}

export function activitySelection(activities: Activity[]): Activity[] {
  const available = [...activities]
  available.sort((a1, a2) => a1.end - a2.end)
  const ret: Activity[] = []
  while (available.length > 0) {
    const activity = available[0]
    ret.push(activity)
    removeWhere(available, a => overlaps(activity, a), { count: Infinity })
  }
  return ret
}
