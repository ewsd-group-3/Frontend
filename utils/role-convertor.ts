export function roleStringConvertor(role: string) {
  return role.toLocaleLowerCase().split('_').join(' ')
}
