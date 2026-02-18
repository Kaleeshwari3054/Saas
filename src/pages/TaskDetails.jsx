import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

const TaskDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    estimatedHours: 0,
    actualHours: 0
  });
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchTask();
  }, [id, token]);

  const fetchTask = async () => {
    try {
      const data = await api.getTask(id, token);
      setTask(data);
      setEditData({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? data.dueDate.split('T')[0] : '',
        estimatedHours: data.estimatedHours,
        actualHours: data.actualHours
      });
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setEditData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours
      });
    }
  };

  const handleSave = async () => {
    try {
      await api.updateTask(id, editData, token);
      fetchTask();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await api.addComment(id, { text: comment }, token);
      setComment('');
      fetchTask();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const getPriorityBadgeClass = (priority) => {
    const classes = {
      'low': 'badge-low',
      'medium': 'badge-medium',
      'high': 'badge-high',
      'critical': 'badge-critical'
    };
    return classes[priority] || 'badge-medium';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'todo': 'badge-todo',
      'in-progress': 'badge-in-progress',
      'review': 'badge-review',
      'completed': 'badge-completed'
    };
    return classes[status] || 'badge-todo';
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading task details...</p>
        </div>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container fluid className="py-4">
        <Card className="card-custom">
          <Card.Body className="text-center py-5">
            <h4>Task Not Found</h4>
            <Link to="/tasks" className="btn btn-primary-custom mt-3">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Tasks
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Link to="/tasks" className="text-decoration-none mb-2 d-inline-block">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Tasks
          </Link>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2>
                <i className="fas fa-tasks me-2"></i>
                {editMode ? (
                  <Form.Control
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="form-control-custom"
                  />
                ) : (
                  task.title
                )}
              </h2>
              {task.isOverdue && (
                <Alert variant="danger" className="mt-2">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  This task is overdue!
                </Alert>
              )}
            </div>
            <Button
              variant={editMode ? "success" : "primary"}
              onClick={editMode ? handleSave : handleEditToggle}
              className={editMode ? "btn-success-custom" : "btn-primary-custom"}
            >
              <i className={`fas ${editMode ? 'fa-save' : 'fa-edit'} me-2`}></i>
              {editMode ? 'Save' : 'Edit'}
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Task Details */}
        <Col lg={8} className="mb-4">
          <Card className="card-custom">
            <Card.Header>
              <i className="fas fa-info-circle me-2"></i>
              Task Details
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h6 className="mb-2">Description</h6>
                {editMode ? (
                  <Form.Control
                    as="textarea"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="form-control-custom"
                    rows={4}
                  />
                ) : (
                  <p className="text-muted">{task.description || 'No description provided'}</p>
                )}
              </div>

              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="mb-2">Status</h6>
                  {editMode ? (
                    <Form.Select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="form-control-custom"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">In Review</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  ) : (
                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                      {task.status}
                    </span>
                  )}
                </Col>
                <Col md={6}>
                  <h6 className="mb-2">Priority</h6>
                  {editMode ? (
                    <Form.Select
                      value={editData.priority}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                      className="form-control-custom"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </Form.Select>
                  ) : (
                    <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  )}
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="mb-2">Due Date</h6>
                  {editMode ? (
                    <Form.Control
                      type="date"
                      value={editData.dueDate}
                      onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                      className="form-control-custom"
                    />
                  ) : (
                    <p className="text-muted">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                    </p>
                  )}
                </Col>
                <Col md={6}>
                  <h6 className="mb-2">Estimated Hours</h6>
                  {editMode ? (
                    <Form.Control
                      type="number"
                      value={editData.estimatedHours}
                      onChange={(e) => setEditData({ ...editData, estimatedHours: parseInt(e.target.value) })}
                      className="form-control-custom"
                      min="0"
                    />
                  ) : (
                    <p className="text-muted">{task.estimatedHours} hours</p>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <h6 className="mb-2">Project</h6>
                  <Link to={`/projects/${task.project?._id}`} className="text-decoration-none">
                    <i className="fas fa-folder me-1"></i>
                    {task.project?.name || 'No Project'}
                  </Link>
                </Col>
                <Col md={6}>
                  <h6 className="mb-2">Assigned To</h6>
                  <p className="text-muted">
                    {task.assignedTo ? (
                      <>
                        <i className="fas fa-user me-1"></i>
                        {task.assignedTo.name}
                      </>
                    ) : (
                      'Unassigned'
                    )}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Comments */}
          <Card className="card-custom mt-4">
            <Card.Header>
              <i className="fas fa-comments me-2"></i>
              Comments ({task.comments?.length || 0})
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddComment} className="mb-4">
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="form-control-custom"
                  />
                </Form.Group>
                <Button
                  type="submit"
                  variant="primary"
                  className="btn-primary-custom mt-2"
                  disabled={!comment.trim()}
                >
                  <i className="fas fa-paper-plane me-2"></i>
                  Add Comment
                </Button>
              </Form>

              <div className="comments-list">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment, index) => (
                    <div key={index} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between">
                        <strong>{comment.user?.name || 'Unknown'}</strong>
                        <small className="text-muted">
                          {new Date(comment.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <p className="mb-0 mt-1">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center">No comments yet</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Task Intelligence */}
        <Col lg={4} className="mb-4">
          <Card className="card-custom">
            <Card.Header>
              <i className="fas fa-brain me-2"></i>
              Smart Intelligence
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h6 className="mb-2">Priority Score</h6>
                <div className="display-4 text-center mb-2">
                  <strong className={task.priorityScore >= 75 ? 'text-danger' : task.priorityScore >= 50 ? 'text-warning' : 'text-success'}>
                    {task.priorityScore || 50}
                  </strong>
                </div>
                <div className="progress progress-custom">
                  <div
                    className="progress-bar"
                    style={{ 
                      width: `${task.priorityScore || 50}%`,
                      backgroundColor: task.priorityScore >= 75 ? '#e74c3c' : task.priorityScore >= 50 ? '#f39c12' : '#27ae60'
                    }}
                  ></div>
                </div>
                <small className="text-muted d-block text-center mt-2">
                  {task.priorityScore >= 75 ? 'High Priority' : task.priorityScore >= 50 ? 'Medium Priority' : 'Low Priority'}
                </small>
              </div>

              <div className="mb-4">
                <h6 className="mb-2">Task Info</h6>
                <div className="row g-2">
                  <Col xs={6}>
                    <small className="text-muted d-block">Created By</small>
                    <span>{task.createdBy?.name || 'Unknown'}</span>
                  </Col>
                  <Col xs={6}>
                    <small className="text-muted d-block">Created At</small>
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </Col>
                </div>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div>
                  <h6 className="mb-2">Tags</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="badge bg-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {task.attachments && task.attachments.length > 0 && (
                <div className="mt-4">
                  <h6 className="mb-2">Attachments</h6>
                  {task.attachments.map((attachment, index) => (
                    <div key={index} className="mb-2">
                      <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                        <i className="fas fa-file me-2"></i>
                        {attachment.name}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskDetails;