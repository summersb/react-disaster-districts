// src/pages/Signup.tsx
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'
import { auth, db } from '@/api'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (data) => {
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
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <Form>
        <Input type="email" label="Email" />
        <Input type="password" label="Password" />
        <Button>Sign Up</Button>
      </Form>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignup}>Submit Access Request</button>
      {error && <p>{error}</p>}
    </div>
  )
}

export default Signup
