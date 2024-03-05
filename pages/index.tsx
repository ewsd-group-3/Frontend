import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      <h1>Hello world</h1>
      <Button>primary</Button>
      <Button variant={'secondary'}>secondary</Button>
      <Button variant={'outline'}> outline</Button>
      <Button variant={'default'}>default</Button>
      <Button variant={'ghost'}>ghost</Button>
      <Button variant={'link'}>link</Button>
    </main>
  )
}
