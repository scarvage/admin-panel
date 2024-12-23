import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { apiService } from '../../../services/api';
import DetailsModal from '../Modals/DetailsModal';

const BlogsTab = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Blog creation state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await apiService.getBlogs();
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', blogTitle);
    formData.append('author', blogAuthor);
    formData.append('content', blogContent);
    formData.append('premium', isPremium);
    if (coverImage) formData.append('coverImage', coverImage);

    try {
      await apiService.createBlog(formData);
      fetchBlogs();
      // Reset form
      setBlogTitle('');
      setBlogAuthor('');
      setBlogContent('');
      setIsPremium(false);
      setCoverImage(null);
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await apiService.deleteBlog(id);
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const viewBlogDetails = async (id) => {
    try {
      const response = await apiService.getBlogDetails(id);
      setSelectedBlog(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching blog details:', error);
    }
  };

  const editorRef = useRef(null);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Create Blog */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Create Blog</h3>
        <form onSubmit={handleCreateBlog} className="space-y-4" encType="multipart/form-data">
          <input 
            type="text" 
            placeholder="Title" 
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            className="w-full p-2 border rounded" 
            required 
          />
          <input 
            type="text" 
            placeholder="Author" 
            value={blogAuthor}
            onChange={(e) => setBlogAuthor(e.target.value)}
            className="w-full p-2 border rounded" 
            required 
          />
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
            />
            <label>Premium Blog</label>
          </div>
          <input 
            type="file" 
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="w-full p-2 border rounded"
            accept="image/*"
            required
          />
          <Editor
            apiKey="your-tinymce-api-key"
            value={blogContent}
            onEditorChange={(content) => setBlogContent(content)}
            init={{
              height: 500,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
            }}
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Blog
          </button>
        </form>
      </div>

      {/* Blogs List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">All Blogs</h3>
        <div className="space-y-4">
          {blogs.map(blog => (
            <div key={blog._id} className="border p-4 rounded">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{blog.title}</h4>
                <div className="space-x-2">
                  <button 
                    onClick={() => viewBlogDetails(blog._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-500">By {blog.author}</p>
              {blog.premium && <p className="text-yellow-600">Premium Blog</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Blog Details Modal */}
      <DetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Blog Details"
      >
        {selectedBlog && (
          <div>
            <h4 className="text-xl font-medium mb-2">{selectedBlog.title}</h4>
            <p className="text-gray-500 mb-4">By {selectedBlog.author}</p>
            {selectedBlog.coverImage && (
              <img 
                src={`https://backend-kve8.onrender.com${selectedBlog.coverImage}`} 
                alt="Cover"   
                className="w-full h-auto mb-4 rounded-lg" 
              />
            )}
            <p className="text-gray-600 mb-4">
              {selectedBlog.premium ? 'Premium Blog' : 'Free Blog'}
            </p>
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />
          </div>
        )}
      </DetailsModal>
    </div>
  );
};

export default BlogsTab;
