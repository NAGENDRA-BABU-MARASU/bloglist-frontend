import { useState, useEffect, useRef } from 'react'
import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from '../../../practice/src/components/Notification'
import Togglable from './components/Togglable'
import './index.css'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      'loggedBloglistUser'
    )
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
					username :
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) =>
              setUsername(target.value)
            }
          />
        </div>
        <div>
					password :
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) =>
              setPassword(target.value)
            }
          />
        </div>
        <button type="submit">login</button>
      </form>
    )
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const handleCreateBlog = async (newBlog) => {
    const returnedBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(returnedBlog))
    setMessage(
      `A new blog ${returnedBlog.title} by ${returnedBlog.author} added!`
    )
    blogFormRef.current.toggleVisibility()
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const likeBlogOf = async (id) => {
    const blogToUpdate = blogs.find(
      (blog) => blog.id === id
    )

    const updatedBlog = await blogService.update({
      likes: blogToUpdate.likes + 1,
      id: blogToUpdate.id,
      author: blogToUpdate.author,
      title: blogToUpdate.title,
      url: blogToUpdate.url,
    })
    setBlogs(
      blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
    )
  }

  const deleteBlogOf = async (id) => {
    const blogToDelete = blogs.find(
      (blog) => blog.id === id
    )
    const message = `Remove blog '${blogToDelete.title}' by ${blogToDelete.author} ?'`
    if (window.confirm(message)) {
      try {
        const response = await blogService.deleteBlog(id)
        console.log(response)
        setBlogs(blogs.filter((blog) => blog.id !== id))
        setMessage('blog deleted successfully')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      } catch (e) {
        setMessage(e.response.data.error)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
  }

  const compareBlogs = (blog1, blog2) => {
    return blog2.likes - blog1.likes
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} />
        <h1>Log in to the app</h1>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      {`${user.name} logged in`}
      <button onClick={() => logout()}>LogOut</button>
      <br />
      <Togglable
        ref={blogFormRef}
        buttonLabel="Create new blog"
      >
        <BlogForm handleCreateBlog={handleCreateBlog} />
      </Togglable>
      <br />
      {blogs.sort(compareBlogs).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlogOf}
          deleteBlog={deleteBlogOf}
        />
      ))}
    </div>
  )
}

export default App
