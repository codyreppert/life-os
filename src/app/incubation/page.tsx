import { redirect } from 'next/navigation'

export default function IncubationPage() {
  redirect('/projects?view=incubation')
}
