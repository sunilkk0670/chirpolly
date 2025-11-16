import React, { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, isDemoModeEnabled } from '../services/firebase';
import { Post, Comment } from '../types';
import {
  createPost,
  fetchPosts,
  addComment,
  fetchComments,
  toggleLike,
  checkIfUserLiked,
  deletePost
} from '../services/communityService';
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Japanese',
  'Hindi', 'Tamil', 'Kannada', 'Telugu', 'Malayalam',
  'Marathi', 'Odia', 'Gujarati', 'Bengali', 'Italian',
  'Dutch', 'Danish', 'Portuguese', 'Finnish', 'Sanskrit'
];

// CreatePost Component
const CreatePost: React.FC<{ onPostCreated: () => void }> = ({ onPostCreated }) => {
  const [firebaseUser] = useAuthState(auth);
  // In demo mode, create a demo user object
  const user = isDemoModeEnabled ? {
    uid: 'demo-user-123',
    email: 'demo@chirpolly.app',
    displayName: 'Demo User',
    emailVerified: true,
  } : firebaseUser;
  
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('English');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await createPost(user.uid, user.displayName || 'Anonymous', content, language);
      setContent('');
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your language learning journey..."
          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
          rows={3}
          disabled={!user}
        />
        <div className="flex items-center justify-between mt-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={!user}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting || !user}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
        {!user && (
          <p className="text-sm text-gray-500 mt-2">Sign in to share your posts</p>
        )}
      </form>
    </div>
  );
};

// CommentSection Component
const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
  const [firebaseUser] = useAuthState(auth);
  // In demo mode, create a demo user object
  const user = isDemoModeEnabled ? {
    uid: 'demo-user-123',
    email: 'demo@chirpolly.app',
    displayName: 'Demo User',
    emailVerified: true,
  } : firebaseUser;
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchComments(postId);
      setComments(fetchedComments);
    };
    loadComments();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, user.uid, user.displayName || 'Anonymous', newComment);
      setNewComment('');
      const updatedComments = await fetchComments(postId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      {/* Comment List */}
      <div className="space-y-3 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {comment.userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-sm text-gray-800">{comment.userName}</p>
                <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-2">No comments yet. Be the first!</p>
        )}
      </div>

      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleAddComment} className="flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </form>
      )}
      {!user && (
        <p className="text-sm text-gray-500 text-center">Sign in to comment</p>
      )}
    </div>
  );
};

// PostCard Component
const PostCard: React.FC<{ post: Post; onDelete: () => void }> = ({ post, onDelete }) => {
  const [firebaseUser] = useAuthState(auth);
  // In demo mode, create a demo user object
  const user = isDemoModeEnabled ? {
    uid: 'demo-user-123',
    email: 'demo@chirpolly.app',
    displayName: 'Demo User',
    emailVerified: true,
  } : firebaseUser;
  
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (user && post.id) {
        const liked = await checkIfUserLiked(post.id, user.uid);
        setIsLiked(liked);
      }
    };
    checkLikeStatus();
  }, [user, post.id]);

  const handleLike = async () => {
    if (!user || !post.id || isLiking) return;

    setIsLiking(true);
    try {
      await toggleLike(post.id, user.uid);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post.id || !user) return;
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(post.id);
      onDelete();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-medium">
            {post.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{post.userName}</p>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()} • {post.language}
            </p>
          </div>
        </div>
        {user && user.uid === post.userId && (
          <button
            onClick={handleDeletePost}
            className="text-red-500 hover:text-red-600 transition-colors"
            title="Delete post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Post Actions */}
      <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleLike}
          disabled={!user || isLiking}
          className={`flex items-center space-x-2 transition-colors ${
            isLiked ? 'text-rose-500' : 'text-gray-600 hover:text-rose-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium">{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-600 hover:text-teal-500 transition-colors"
        >
          <MessageCircle size={20} />
          <span className="text-sm font-medium">{post.commentsCount}</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && post.id && <CommentSection postId={post.id} />}
    </div>
  );
};

// Main SocialFeed Component
const SocialFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost onPostCreated={loadPosts} />

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          <p className="text-gray-500 mt-2">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={loadPosts} />
        ))
      )}
    </div>
  );
};

export default SocialFeed;
