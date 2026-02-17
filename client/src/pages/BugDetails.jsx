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
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [postingComment, setPostingComment] = useState(false)

  const fetchBug = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/bugs/${id}`)
      setBug(data)
    } catch (err) {
      navigate('/bugs')
    } finally {
      setLoading(false)
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
    setPostingComment(true)
    try {
      await api.post(`/bugs/${id}/comments`, { comment })
      setComment('')
      fetchComments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment')
    } finally {
      setPostingComment(false)
    }
  }

  const removeComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await api.delete(`/bugs/${id}/comments/${commentId}`)
      fetchComments()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  const deleteBug = async () => {
    const confirmed = window.confirm('Delete this bug? This action can be undone by admins.')
    if (!confirmed) return
    setError('')
    setDeleting(true)
    try {
      await api.delete(`/bugs/${id}`)
      navigate('/bugs')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete bug')
    } finally {
      setDeleting(false)
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#6c757d',
      medium: '#ffd166',
      high: '#ef476f',
      critical: '#c1121f'
    }
    return colors[priority.toLowerCase()] || colors.medium
  }

  const getStatusColor = (status) => {
    const colors = {
      open: '#ffb703',
      'in-progress': '#219ebc',
      resolved: '#8ecae6',
      closed: '#adb5bd',
      reopened: '#ef476f'
    }
    return colors[status.replace(' ', '-').toLowerCase()] || '#adb5bd'
  }

  if (loading) {
    return (
      <div className="page">
        <div className="bug-details-loading">
          <div className="skeleton-header-large" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>
    )
  }

  if (!bug) {
    return <div className="page"><div className="card">Bug not found.</div></div>
  }

  return (
    <div className="page bug-details-page">
      <div className="page-header">
        <div>
          <h2>Bug #{bug.id}</h2>
          <p>{bug.title}</p>
        </div>
        <div className="actions">
          {(user?.role === 'org_admin') && (
            <button 
              className="ghost btn-danger" 
              onClick={deleteBug} 
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Bug'}
            </button>
          )}
          <Link to="/bugs" className="ghost">Back to bugs</Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card card-animate details-card">
        <h3>Details</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span 
              className="pill status-pill"
              style={{ 
                backgroundColor: getStatusColor(bug.status) + '20', 
                color: getStatusColor(bug.status) 
              }}
            >
              {bug.status}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Priority</span>
            <span 
              className="pill priority-pill"
              style={{ 
                backgroundColor: getPriorityColor(bug.priority) + '20', 
                color: getPriorityColor(bug.priority) 
              }}
            >
              {bug.priority}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Created By</span>
            <span className="detail-value">{bug.created_by_name || 'Unknown'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Assignee</span>
            <span className="detail-value">{bug.assigned_to_name || <span className="hint">Unassigned</span>}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Assigned By</span>
            <span className="detail-value">{bug.assigned_by_name || '—'}</span>
          </div>
          <div className="detail-item full">
            <span className="detail-label">Description</span>
            <p className="detail-description">{bug.description || <span className="hint">No description provided.</span>}</p>
          </div>
        </div>
      </div>

      <div className="card card-animate comments-card">
        <h3>Comments {comments.length > 0 && <span className="badge">{comments.length}</span>}</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form className="comment-form" onSubmit={addComment}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            placeholder="Add a comment..."
            className="comment-input"
          />
          <button className="primary" type="submit" disabled={postingComment || !comment.trim()}>
            {postingComment ? (
              <>
                <span className="spinner" />
                Posting...
              </>
            ) : (
              'Post comment'
            )}
          </button>
        </form>
        <div className="comment-list">
          {comments.length === 0 && (
            <div className="empty-state">
              <p className="hint">No comments yet. Be the first to comment!</p>
            </div>
          )}
          {comments.map((item, index) => (
            <div 
              className="comment comment-animate" 
              key={item.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="comment-header">
                <div>
                  <strong className="comment-author">{item.author_name}</strong>
                  <span className="comment-date">{new Date(item.created_at).toLocaleString()}</span>
                </div>
                {((user?.role === 'org_admin' || user?.role === 'project_admin') || user?.id === item.user_id) && (
                  <button 
                    className="ghost btn-danger small" 
                    onClick={() => removeComment(item.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="comment-text">{item.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BugDetails
