import uniqolor from 'uniqolor'

export function colorGenerator(title: string, opacity?: number) {
  return opacity ? `${uniqolor(title).color}` + opacity : `${uniqolor(title).color}`
}
