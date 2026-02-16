import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { setAuthToken } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem('bt_token')
      if (!storedToken) {
        setLoading(false)
        return
      }

      setAuthToken(storedToken)
      try {
        const { data } = await api.get('/auth/me')
        setToken(storedToken)
        setUser(data)
        localStorage.setItem('bt_user', JSON.stringify(data))
      } catch (error) {
        localStorage.removeItem('bt_token')
        localStorage.removeItem('bt_user')
        setToken(null)
        setUser(null)
        setAuthToken(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('bt_token', data.token)
    localStorage.setItem('bt_user', JSON.stringify(data.user))
    setAuthToken(data.token)
    return data.user
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    return data
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('bt_token')
    localStorage.removeItem('bt_user')
    setAuthToken(null)
  }

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('bt_user', JSON.stringify(updatedUser))
  }, [])

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, updateUser }),
    [user, token, loading, updateUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
