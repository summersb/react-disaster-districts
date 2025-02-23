import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'
import { auth, db } from '@/api'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import StyledButton from '@/components/styled/StyledButton'
import { useForm } from 'react-hook-form'

const Signup = (): React.ReactElement => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const form = useForm<{ email: string; password: string }>()
  const onSubmit = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const user = userCredential.user

      // Add access request to Firestore
      await addDoc(collection(db, 'accessRequests'), {
        uid: user.uid,
        email: user.email,
        status: 'pending',
        createdAt: new Date(),
      })

      // Success
      alert('Request submitted!')
    } catch (error: unknown) {
      setError(`${error}`)
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <StyledButton type="submit">Submit Access Request</StyledButton>
        </form>
      </Form>
      {error && <p>{error}</p>}
    </div>
  )
}

export default Signup
