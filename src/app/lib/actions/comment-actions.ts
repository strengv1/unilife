'use server'

import { db } from '@/app/lib/db'
import { comments, tournaments } from '@/app/lib/schema'
import { desc, eq, and, count } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { verifyAuth } from '../auth'

export type Comment = {
  id: number
  nickname: string
  message: string
  createdAt: Date
}

export type CommentStats = {
  total: number
  hasMore: boolean
}

const PROFANITY_WORDS = [
  'neekeri', 'nerku', 'nigger'
]

function containsProfanity(text: string): boolean {
  const normalized = text
    .toLowerCase()
    .replace(/[0@]/g, 'o')
    .replace(/[1!|]/g, 'i')
    .replace(/[3]/g, 'e')
    .replace(/[4@]/g, 'a')
    .replace(/[5$]/g, 's')
    .replace(/[7]/g, 't')
    .replace(/\s+/g, '')

  return PROFANITY_WORDS.some(word => normalized.includes(word))
}

// Get comments with pagination and stats
export async function getComments(
  tournamentId: number,
  page: number = 1,
  limit: number = 20
): Promise<{ comments: Comment[]; stats: CommentStats }> {
  try {
    const offset = (page - 1) * limit

    const [commentsResult, statsResult] = await Promise.all([
      db
        .select({
          id: comments.id,
          nickname: comments.nickname,
          message: comments.message,
          createdAt: comments.createdAt,
        })
        .from(comments)
        .where(
          and(
            eq(comments.tournamentId, tournamentId),
            eq(comments.isDeleted, false)
          )
        )
        .orderBy(desc(comments.createdAt))
        .limit(limit + 1) // Get one extra to check if there are more
        .offset(offset),
      
      db
        .select({ count: count() })
        .from(comments)
        .where(
          and(
            eq(comments.tournamentId, tournamentId),
            eq(comments.isDeleted, false)
          )
        )
    ])

    const hasMore = commentsResult.length > limit
    const actualComments = hasMore ? commentsResult.slice(0, -1) : commentsResult
    const total = statsResult[0]?.count || 0

    return {
      comments: actualComments,
      stats: {
        total,
        hasMore
      }
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    return {
      comments: [],
      stats: { total: 0, hasMore: false }
    }
  }
}

// Enhanced comment validation and sanitization
function sanitizeInput(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/<[^>]*>/g, '') // Remove HTML tags
}

export async function addComment(
  tournamentId: number,
  nickname: string,
  message: string
): Promise<{ 
  success: boolean
  error?: string
  comment?: Comment
  rateLimitInfo?: {
    remaining: number
    resetTime: number
  }
}> {
  try {
    // Sanitize inputs
    const cleanNickname = sanitizeInput(nickname)
    const cleanMessage = sanitizeInput(message)

    // Check profanity
    if (containsProfanity(cleanNickname) || containsProfanity(cleanMessage)) {
      return { success: false, error: 'Content contains inappropriate language' }
    }

    // Get IP for rate limiting
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
               headersList.get('x-real-ip') || 
               'unknown'

    // Verify tournament exists and comments are enabled
    const tournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, tournamentId),
    })

    if (!tournament) {
      return { success: false, error: 'Tournament not found' }
    }

    // Insert comment
    const [newComment] = await db.insert(comments).values({
      tournamentId,
      nickname: cleanNickname,
      message: cleanMessage,
      ipAddress: ip,
    }).returning()

    // Revalidate the tournament page
    revalidatePath(`/tournament/${tournament.slug}`)
    
    return { 
      success: true, 
      comment: newComment
    }
  } catch (error) {
    console.error('Failed to add comment:', error)
    return { success: false, error: 'Failed to post comment. Please try again.' }
  }
}

// Enhanced delete with audit trail
export async function deleteComment(
  commentId: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const isAuthenticated = await verifyAuth()
    if (!isAuthenticated) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get comment details before deletion for audit
    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, commentId),
      with: {
        tournament: true
      }
    })

    if (!comment) {
      return { success: false, error: 'Comment not found' }
    }

    await db
      .update(comments)
      .set({ 
        isDeleted: true,
        // You might want to add deletedAt timestamp and deletedBy fields
      })
      .where(eq(comments.id, commentId))

    return { success: true }
  } catch (error) {
    console.error('Failed to delete comment:', error)
    return { success: false, error: 'Failed to delete comment' }
  }
}

// Bulk operations for admin
export async function getCommentsForModeration(
  page: number = 1,
  limit: number = 50
): Promise<{
  comments: Array<Comment & { tournamentName: string }>
  total: number
}> {
  const isAuthenticated = await verifyAuth()
  if (!isAuthenticated) {
    return { comments: [], total: 0 }
  }

  try {
    const offset = (page - 1) * limit

    const [commentsResult, totalResult] = await Promise.all([
      db
        .select({
          id: comments.id,
          nickname: comments.nickname,
          message: comments.message,
          createdAt: comments.createdAt,
          tournamentName: tournaments.name,
        })
        .from(comments)
        .innerJoin(tournaments, eq(comments.tournamentId, tournaments.id))
        .where(eq(comments.isDeleted, false))
        .orderBy(desc(comments.createdAt))
        .limit(limit)
        .offset(offset),
      
      db
        .select({ count: count() })
        .from(comments)
        .where(eq(comments.isDeleted, false))
    ])

    return {
      comments: commentsResult,
      total: totalResult[0]?.count || 0
    }
  } catch (error) {
    console.error('Failed to fetch comments for moderation:', error)
    return { comments: [], total: 0 }
  }
}