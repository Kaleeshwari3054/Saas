import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

const Tasks = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState({
    status: '',
    priority: '',
    sortBy: 'createdAt'
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: projectId || '',
    priority: 'medium',
    dueDate: '',
    estimatedHours: 0
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [token, filter, projectId]);

  const fetchTasks = async () => {
    try {
      const params = {
        ...filter,
        project: projectId || filter.project || ''
      };
      const data = await api.getTasks(token, params);
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects(token);
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      title: '',
      description: '',
      project: projectId || '',
      priority: 'medium',
      dueDate: '',
      estimatedHours: 0
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.createTask(formData, token);
      handleCloseModal();
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.deleteTask(id, token);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
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
          <p className="mt-3">Loading tasks...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="fas fa-tasks me-2"></i>
            Tasks
          </h2>
          <p className="text-muted">Manage and track your tasks</p>
        </Col>
        <Col xs="auto">
          <Button className="btn-primary-custom" onClick={handleShowModal}>
            <i className="fas fa-plus me-2"></i>
            New Task
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            className="form-control-custom"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            name="priority"
            value={filter.priority}
            onChange={handleFilterChange}
            className="form-control-custom"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            name="sortBy"
            value={filter.sortBy}
            onChange={handleFilterChange}
            className="form-control-custom"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            name="project"
            value={filter.project}
            onChange={handleFilterChange}
            className="form-control-custom"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {tasks.length > 0 ? (
        <Row>
          {tasks.map(task => (
            <Col key={task._id} md={6} lg={4} className="mb-4">
              <Card className={`card-custom h-100 task-item priority-${task.priority}`}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0">
                      <Link to={`/tasks/${task._id}`} className="text-decoration-none">
                        {task.title}
                      </Link>
                    </h6>
                    {task.isOverdue && (
                      <span className="badge bg-danger">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Overdue
                      </span>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="text-muted small mb-2">{task.description}</p>
                  )}
                  
                  <div className="mb-2">
                    <small className="text-muted">
                      <i className="fas fa-folder me-1"></i>
                      {task.project?.name || 'No Project'}
                    </small>
                  </div>

                  <div className="mb-2">
                    {task.dueDate && (
                      <small className="text-muted">
                        <i className="fas fa-calendar me-1"></i>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className={`badge ${getPriorityBadgeClass(task.priority)} me-2`}>
                      {task.priority}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  {task.assignedTo && (
                    <div className="mb-3">
                      <small className="text-muted d-block">Assigned to</small>
                      <strong>{task.assignedTo.name}</strong>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Priority Score: <strong>{task.priorityScore || 50}</strong>
                    </small>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(task._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="card-custom">
          <Card.Body className="text-center py-5">
            <i className="fas fa-tasks fa-4x text-muted mb-4"></i>
            <h4>No Tasks Found</h4>
            <p className="text-muted">Create your first task to get started!</p>
            <Button className="btn-primary-custom" onClick={handleShowModal}>
              <i className="fas fa-plus me-2"></i>
              Create Task
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Create Task Modal */}
      <Modal show={showModal} onHide={handleCloseModal} className="modal-custom" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus me-2"></i>
            Create New Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-control-custom"
                    placeholder="Enter task title"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project</Form.Label>
                  <Form.Select
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className="form-control-custom"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control-custom"
                placeholder="Enter task description"
                rows={3}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="form-control-custom"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estimated Hours</Form.Label>
                  <Form.Control
                    type="number"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleChange}
                    className="form-control-custom"
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-4">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="btn-primary-custom flex-grow-1"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Tasks;