'use client'

import { useState, useTransition, useCallback, useRef, useEffect } from 'react'
import { addComment, getComments, type Comment, type CommentStats } from '@/app/lib/actions/comment-actions'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { formatDistanceToNow } from 'date-fns'

interface CommentSectionProps {
  tournamentId: number
  initialComments: Comment[]
  initialStats: CommentStats
  onSuccess?: () => void
}

export default function CommentSection({ 
  tournamentId, 
  initialComments, 
  initialStats,
  onSuccess 
}: CommentSectionProps) {
  const [nickname, setNickname] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialStats.hasMore)
  const [page, setPage] = useState(1)
  
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [comments, setComments] = useState<Comment[]>(initialComments)

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
  }, [message, adjustTextareaHeight])

  // Intersection observer for infinite scroll
  const { isIntersecting } = useIntersectionObserver(loadMoreRef, {
    threshold: 0.1,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoadingMore) {
      loadMoreComments()
    }
  }, [isIntersecting, hasMore, isLoadingMore])

  const loadMoreComments = async () => {
    if (isLoadingMore) return
    
    setIsLoadingMore(true)
    try {
      const result = await getComments(tournamentId, page + 1, 20)
      if (result.comments.length > 0) {
        setComments(prev => [...prev, ...result.comments])
        setPage(prev => prev + 1)
      }
      setHasMore(result.stats.hasMore)
    } catch (error) {
      console.error('Failed to load more comments:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!nickname.trim()) {
      setError('Nickname is required')
      return
    }
    if (!message.trim()) {
      setError('Message is required')
      return
    }

    startTransition(async () => {      
      try {
        const result = await addComment(tournamentId, nickname.trim(), message.trim())
        
        if (!result.success) {
          setError(result.error || 'Failed to post comment')
        } else {
          setNickname('')
          setMessage('')
          setShowForm(false)
          onSuccess?.()
        }
      } catch (error) {
        setError('Network error. Please try again.')
      }
    })
  }

  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      // Fallback for invalid dates
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
  }

  const getRemainingChars = (text: string, max: number) => {
    const remaining = max - text.length
    return { remaining, isNearLimit: remaining < 100 }
  }

  const nicknameLimit = getRemainingChars(nickname, 50)
  const messageLimit = getRemainingChars(message, 1000)

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header with comment count and post button */}
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Discussion</h3>
          <p className="text-sm text-gray-600">
            {initialStats.total} comment{initialStats.total !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (!showForm) {
              // Focus nickname input after a brief delay to ensure form is rendered
              setTimeout(() => {
                const nicknameInput = document.getElementById('nickname')
                nicknameInput?.focus()
              }, 100)
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={isPending}
        >
          {showForm ? 'Cancel' : '+ Comment'}
        </button>
      </div>

      {/* Comment Form - Enhanced UX */}
      {showForm && (
        <div className="p-4 border-b bg-blue-50">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                Nickname
              </label>
              <div className="relative">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={50}
                  className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Your nickname..."
                  disabled={isPending}
                  autoFocus
                />
                <div className={`absolute right-3 top-2 text-xs ${nicknameLimit.isNearLimit ? 'text-red-500' : 'text-gray-400'}`}>
                  {nicknameLimit.remaining}
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                  }}
                  maxLength={1000}
                  rows={3}
                  className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[80px] max-h-[200px] overflow-y-auto"
                  placeholder="Share your thoughts..."
                  disabled={isPending}
                  style={{ height: 'auto' }}
                />
                <div className={`text-xs mt-1 text-right ${messageLimit.isNearLimit ? 'text-red-500' : 'text-gray-500'}`}>
                  {messageLimit.remaining} characters remaining
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending || !nickname.trim() || !message.trim() || nicknameLimit.remaining < 0 || messageLimit.remaining < 0}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isPending && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isPending ? 'Posting...' : 'Post Comment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setError('')
                }}
                className="px-4 py-2.5 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-base font-medium">No comments yet</p>
            <p className="text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {comments.map((comment) => (
              <div 
                key={`comment-${comment.id}`}
                className="p-4 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">
                      {comment.nickname}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2 shrink-0">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {comment.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More / Infinite Scroll */}
      {hasMore && (
        <div ref={loadMoreRef} className="p-4 text-center border-t">
          {isLoadingMore ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm text-gray-500">Loading more comments...</span>
            </div>
          ) : (
            <button
              onClick={loadMoreComments}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
            >
              Load more comments
            </button>
          )}
        </div>
      )}

      {/* Footer info */}
      {comments.length > 0 && !hasMore && (
        <div className="p-3 bg-gray-50 border-t text-center text-xs text-gray-500">
          {comments.length === 1 ? 
            'Showing 1 comment' : 
            `Showing all ${comments.length} comments`
          }
        </div>
      )}
    </div>
  )
}