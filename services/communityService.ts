import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  getDoc,
  onSnapshot,
  serverTimestamp,
  increment,
  where,
  Timestamp
} from 'firebase/firestore';
import { db, isDemoModeEnabled } from './firebase';
import type { Post, Comment, Like } from '../types';

// In-memory storage for demo mode
let demoPostsStore: Post[] = [];
let demoCommentsStore: Comment[] = [];
let demoLikesStore: Like[] = [];
let demoIdCounter = 1;

// ============ POSTS ============

export const createPost = async (
  userId: string,
  userName: string,
  content: string,
  language?: string,
  userAvatar?: string,
  imageUrl?: string
): Promise<string> => {
  if (isDemoModeEnabled) {
    const postId = `demo-post-${demoIdCounter++}`;
    const newPost: Post = {
      id: postId,
      userId,
      userName,
      userAvatar: userAvatar || null,
      content,
      imageUrl: imageUrl || null,
      language: language || null,
      createdAt: Date.now(),
      likesCount: 0,
      commentsCount: 0,
    };
    demoPostsStore.unshift(newPost); // Add to beginning for reverse chronological
    return postId;
  }

  try {
    const postData = {
      userId,
      userName,
      userAvatar: userAvatar || null,
      content,
      imageUrl: imageUrl || null,
      language: language || null,
      createdAt: serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
    };

    const docRef = await addDoc(collection(db, 'posts'), postData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
};

export const fetchPosts = async (limitCount: number = 20): Promise<Post[]> => {
  if (isDemoModeEnabled) {
    return demoPostsStore.slice(0, limitCount);
  }

  try {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      } as Post);
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const subscribeToPost = (postId: string, callback: (posts: Post[]) => void) => {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  return onSnapshot(q, (snapshot) => {
    const posts: Post[] = [];
    snapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      } as Post);
    });
    callback(posts);
  });
}

export const deletePost = async (postId: string): Promise<void> => {
  if (isDemoModeEnabled) {
    demoPostsStore = demoPostsStore.filter(p => p.id !== postId);
    demoCommentsStore = demoCommentsStore.filter(c => c.postId !== postId);
    demoLikesStore = demoLikesStore.filter(l => l.postId !== postId);
    return;
  }

  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
};

// ============ COMMENTS ============

export const addComment = async (
  postId: string,
  userId: string,
  userName: string,
  content: string,
  userAvatar?: string
): Promise<string> => {
  if (isDemoModeEnabled) {
    const commentId = `demo-comment-${demoIdCounter++}`;
    const newComment: Comment = {
      id: commentId,
      postId,
      userId,
      userName,
      userAvatar: userAvatar || null,
      content,
      createdAt: Date.now(),
    };
    demoCommentsStore.push(newComment);
    
    // Increment comment count on post
    const post = demoPostsStore.find(p => p.id === postId);
    if (post) {
      post.commentsCount++;
    }
    
    return commentId;
  }

  try {
    const commentData = {
      postId,
      userId,
      userName,
      userAvatar: userAvatar || null,
      content,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'comments'), commentData);
    
    // Increment comments count on the post
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      commentsCount: increment(1),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
};

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  if (isDemoModeEnabled) {
    return demoCommentsStore.filter(c => c.postId === postId);
  }

  try {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const comments: Comment[] = [];
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
      } as Comment);
    });
    
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const subscribeToComments = (postId: string, callback: (comments: Comment[]) => void) => {
  const q = query(
    collection(db, 'comments'),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const comments: Comment[] = [];
    snapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
      } as Comment);
    });
    callback(comments);
  });
}

// ============ LIKES ============

export const toggleLike = async (postId: string, userId: string): Promise<boolean> => {
  if (isDemoModeEnabled) {
    const existingLike = demoLikesStore.find(l => l.postId === postId && l.userId === userId);
    const post = demoPostsStore.find(p => p.id === postId);
    
    if (existingLike) {
      // Unlike
      demoLikesStore = demoLikesStore.filter(l => l.id !== existingLike.id);
      if (post) {
        post.likesCount = Math.max(0, post.likesCount - 1);
      }
      return false;
    } else {
      // Like
      const likeId = `demo-like-${demoIdCounter++}`;
      demoLikesStore.push({
        id: likeId,
        postId,
        userId,
        createdAt: Date.now(),
      });
      if (post) {
        post.likesCount++;
      }
      return true;
    }
  }

  try {
    // Check if user already liked the post
    const q = query(
      collection(db, 'likes'),
      where('postId', '==', postId),
      where('userId', '==', userId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Unlike: delete the like document
      const likeDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, 'likes', likeDoc.id));
      
      // Decrement likes count on the post
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likesCount: increment(-1),
      });
      
      return false; // unliked
    } else {
      // Like: create a new like document
      const likeData = {
        postId,
        userId,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'likes'), likeData);
      
      // Increment likes count on the post
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likesCount: increment(1),
      });
      
      return true; // liked
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw new Error('Failed to toggle like');
  }
};

export const checkIfUserLiked = async (postId: string, userId: string): Promise<boolean> => {
  if (isDemoModeEnabled) {
    return demoLikesStore.some(l => l.postId === postId && l.userId === userId);
  }

  try {
    const q = query(
      collection(db, 'likes'),
      where('postId', '==', postId),
      where('userId', '==', userId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
};
