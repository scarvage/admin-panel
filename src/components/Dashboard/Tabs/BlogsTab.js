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
    try {
      await apiService.createBlog({
        title: blogTitle,
        author: blogAuthor,
        content: blogContent
      });
      fetchBlogs();
      // Reset form
      setBlogTitle('');
      setBlogAuthor('');
      setBlogContent('');
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
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Create Blog */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Create Blog</h3>
        <form onSubmit={handleCreateBlog} className="space-y-4">
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
          
          <Editor
            apiKey='fif605zvbtiis0tl08np06dgb9m4mh94057sgeimyrq4ee06'
            value={blogContent}
            onInit={(_evt, editor) => editorRef.current = editor}
            onEditorChange={(content) => console.log(content)}
            init={{
              height: 500,
              menubar: 'file edit insert view format table tools help',
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
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
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{__html: selectedBlog.content}}
            />
          </div>
        )}
      </DetailsModal>
    </div>
  );
};

export default BlogsTab;