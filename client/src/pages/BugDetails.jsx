import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const BugDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bug, setBug] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  const fetchBug = async () => {
    try {
      const { data } = await api.get(`/bugs/${id}`)
      setBug(data)
    } catch (err) {
      navigate('/bugs')
    }
  }

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/bugs/${id}/comments`)
      setComments(data)
    } catch (err) {
      setComments([])
    }
  }

  useEffect(() => {
    fetchBug()
    fetchComments()
  }, [id])

  const addComment = async (e) => {
    e.preventDefault()
    setError('')
    if (!comment.trim()) return
    try {
      await api.post(`/bugs/${id}/comments`, { comment })
      setComment('')
      fetchComments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment')
    }
  }

  const removeComment = async (commentId) => {
    try {
      await api.delete(`/bugs/${id}/comments/${commentId}`)
      fetchComments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  if (!bug) {
    return <div className="page"><div className="card">Loading bug...</div></div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Bug #{bug.id}</h2>
          <p>{bug.title}</p>
        </div>
        <Link to="/bugs" className="ghost">Back to bugs</Link>
      </div>

      <div className="card">
        <h3>Details</h3>
        <p><strong>Status:</strong> {bug.status}</p>
        <p><strong>Priority:</strong> {bug.priority}</p>
        <p><strong>Assignee:</strong> {bug.assigned_to_name || 'Unassigned'}</p>
        <p><strong>Description:</strong> {bug.description || 'No description provided.'}</p>
      </div>

      <div className="card">
        <h3>Comments</h3>
        {error && <div className="alert">{error}</div>}
        <form className="comment-form" onSubmit={addComment}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            placeholder="Add a comment..."
          />
          <button className="primary" type="submit">Post comment</button>
        </form>
        <div className="comment-list">
          {comments.length === 0 && <p className="hint">No comments yet.</p>}
          {comments.map((item) => (
            <div className="comment" key={item.id}>
              <div>
                <strong>{item.author_name}</strong>
                <span>{new Date(item.created_at).toLocaleString()}</span>
              </div>
              <p>{item.comment}</p>
              {(user?.role === 'Admin' || user?.id === item.user_id) && (
                <button className="ghost" onClick={() => removeComment(item.id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BugDetails
