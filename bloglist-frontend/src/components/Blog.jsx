import React, { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)
  const changeVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    border: '1px solid black',
    padding: '20px',
    margin: '20px 0',
    borderRadius: '5px',
  }

  const buttonStyle = {
    padding: '5px',
    margin: '0 10px',
    fontSize: '1rem',
  }

  const deleteButtonStyle = {
    color: 'white',
    backgroundColor: 'red',
    padding: '2px 20px',
    margin: '5px 0',
    borderRadius: '5px',
  }

  if (!visible) {
    return (
      <div style={blogStyle}>
        <b>{blog.title}</b> - {blog.author}
        <button
          style={buttonStyle}
          onClick={changeVisibility}
        >
          {visible ? 'hide' : 'view'}
        </button>
      </div>
    )
  }
  return (
    <div style={blogStyle}>
      <p>
        <b>{blog.title} </b>
        <button
          style={buttonStyle}
          onClick={changeVisibility}
        >
          {visible ? 'hide' : 'view'}
        </button>
      </p>
      <a href={blog.url} target="blank">
        {blog.url}
      </a>
      <p>
				likes: {blog.likes}
        <button
          style={{ margin: '0px 10px' }}
          onClick={() => likeBlog(blog.id)}
        >
					like
        </button>
      </p>
      <p>{blog.author}</p>
      <button
        style={deleteButtonStyle}
        onClick={() => deleteBlog(blog.id)}
      >
				delete
      </button>
    </div>
  )
}

export default Blog
