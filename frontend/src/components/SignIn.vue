<!-- SignIn.vue -->
<template>
  <div class="sign-in-form">
    <h2>Admin Sign In</h2>
    <form @submit.prevent="signIn">
      <label>Email:</label>
      <input v-model="email" type="email" required />

      <label>Password:</label>
      <input v-model="password" type="password" required />

      <button type="submit">Sign In</button>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import {
    getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence
  } from 'firebase/auth'
  import { useRouter } from 'vue-router'

  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')

  const auth = getAuth()
  const router = useRouter()

  /**
  * Handles the sign-in logic for admin users.
  * - Uses Firebase Auth to log in with email and password.
  * - Sets session persistence to `browserSessionPersistence`.
  * - Redirects to `/admin/dashboard` on success.
  * - Displays meaningful error messages on failure.
  */
  async function signIn() {
    errorMessage.value = ''
    try {
      // Set session persistence so that the authentication state is valid only for this tab session
      await setPersistence(auth, browserSessionPersistence)

      // Sign in the user with the provided email and password
      await signInWithEmailAndPassword(auth, email.value, password.value)

      // Redirect to the admin dashboard upon successful sign-in
      router.push('/admin/dashboard')
    } catch (error) {
      handleError(error)
    }
  }

  /**
  * Maps Firebase authentication error codes to user-friendly messages
  * shown below the sign-in form.
  *
  * param error - The error object returned by Firebase Auth
  */
  function handleError(error) {
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage.value = 'No account found with this email.'
        break
      case 'auth/wrong-password':
        errorMessage.value = 'Incorrect password. Please try again.'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'The email address is not valid.'
        break
      case 'auth/too-many-requests':
        errorMessage.value = 'Too many failed attempts. Try again later.'
        break
      default:
        errorMessage.value = 'Sign-in failed. Please check your credentials.'
    }
  }
</script>
