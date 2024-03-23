import React, { useState } from 'react'
const BlogForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url,
    }
    handleCreateBlog(blogObject)
    setTitle('')
    setUrl('')
    setAuthor('')
  }

  return (
    <form onSubmit={handleSubmit}>
			title :
      <input
        type="text"
        value={title}
        name="title"
        onChange={({ target }) => setTitle(target.value)}
      />
      <br />
			author :
      <input
        type="text"
        value={author}
        name="author"
        onChange={({ target }) => setAuthor(target.value)}
      />
      <br />
			url :
      <input
        type="text"
        value={url}
        name="url"
        onChange={({ target }) => setUrl(target.value)}
      />
      <br />
      <button type="submit">Create blog</button>
    </form>
  )
}

export default BlogForm
