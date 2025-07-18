import React, { useState, useEffect } from 'react';
import { mockAPI } from '../../api/api';

const PostManager = () => {
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await mockAPI.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setFormData({ title: '', description: '', image: '' });
    setOpenDialog(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      image: post.image
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingPost) {
        setPosts(posts.map(post =>
          post.id === editingPost.id
            ? { ...post, ...formData }
            : post
        ));
      } else {
        const response = await mockAPI.createPost(formData);
        setPosts([response.data, ...posts]);
      }
      setOpenDialog(false);
      setFormData({ title: '', description: '', image: '' });
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const mockImageUrl = `https://via.placeholder.com/600x300/4CAF50/white?text=${encodeURIComponent(file.name)}`;
      setFormData({ ...formData, image: mockImageUrl });
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Post Management</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm"
          onClick={handleCreatePost}
        >
          + Create Post
        </button>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg mb-6 overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-72 object-cover" />

          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <button
                className="text-blue-500 hover:underline text-sm"
                onClick={() => handleEditPost(post)}
              >
                Edit
              </button>
            </div>

            <p className="text-gray-700 mb-4">{post.description}</p>

            <div className="flex items-center gap-4 mb-4 text-sm">
              <span className="flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500 text-white">
                {post.likes} Likes
              </span>
              <span className="px-3 py-1 border border-gray-300 rounded-full text-sm">
                {post.comments?.length || 0} Comments
              </span>
            </div>

            {post.comments?.length > 0 && (
              <div className="border-t pt-3">
                <h3 className="font-medium mb-2">Recent Comments:</h3>
                {post.comments.slice(0, 3).map((comment) => (
                  <div key={comment.id} className="bg-gray-100 rounded p-2 mb-2">
                    <p className="text-sm">
                      <strong className="text-blue-600">{comment.userName}:</strong> {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
            <h2 className="text-2xl font-bold mb-4">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              required
            />

            <label className="block w-full cursor-pointer mb-4">
              <span className="block text-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-100">
                Upload Image
              </span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </label>

            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.title || !formData.description}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {editingPost ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManager;
